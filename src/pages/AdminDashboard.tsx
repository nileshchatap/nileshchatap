import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Trash2, RefreshCw, Shield, Plus, Save, X, Upload, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import SortableItem from "@/components/admin/SortableItem";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [hero, setHero] = useState<any>(null);
  const [about, setAbout] = useState<any>(null);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);

  const [newExp, setNewExp] = useState({ company: "", role: "", period: "", location: "" });
  const [newEdu, setNewEdu] = useState({ institution: "", degree: "", period: "" });
  const [newSkill, setNewSkill] = useState("");
  const [newCert, setNewCert] = useState("");
  const [newProject, setNewProject] = useState({ title: "", bullets: "", project_url: "" });
  const [newStat, setNewStat] = useState({ icon: "Award", value: "", label: "" });
  const [photoUploading, setPhotoUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate("/admin");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/admin");
      else loadAll();
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadAll = async () => {
    setLoading(true);
    const [sub, h, exp, edu, sk, cert, proj, st, subs, ab] = await Promise.all([
      supabase.from("submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("site_hero").select("*").limit(1).single(),
      supabase.from("site_experiences").select("*").order("sort_order"),
      supabase.from("site_education").select("*").order("sort_order"),
      supabase.from("site_skills").select("*").order("sort_order"),
      supabase.from("site_certifications").select("*").order("sort_order"),
      supabase.from("site_projects").select("*").order("sort_order"),
      supabase.from("site_stats").select("*").order("sort_order"),
      (supabase as any).from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
      (supabase as any).from("site_about").select("*").limit(1).single(),
    ]);
    setSubmissions(sub.data || []);
    setHero(h.data);
    setExperiences(exp.data || []);
    setEducation(edu.data || []);
    setSkills(sk.data || []);
    setCertifications(cert.data || []);
    setProjects(proj.data || []);
    setStats(st.data || []);
    setSubscribers(subs.data || []);
    setAbout(ab.data);
    setLoading(false);
  };

  const invalidateAll = () => {
    ["site_hero", "site_experiences", "site_education", "site_skills", "site_certifications", "site_projects", "site_stats", "site_about"].forEach(
      key => queryClient.invalidateQueries({ queryKey: [key] })
    );
  };

  const saveAbout = async () => {
    if (!about) return;
    const { error } = await (supabase as any).from("site_about").update({ content: about.content }).eq("id", about.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "About updated!" }); invalidateAll(); }
  };

  const handleReorder = useCallback(async (tableName: string, items: any[], setItems: (items: any[]) => void, event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);
    
    await Promise.all(reordered.map((item, idx) =>
      (supabase as any).from(tableName).update({ sort_order: idx }).eq("id", item.id)
    ));
    invalidateAll();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("submissions").delete().eq("id", id);
    if (error) toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
    else { setSubmissions(prev => prev.filter(s => s.id !== id)); toast({ title: "Deleted" }); }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/admin"); };

  const saveHero = async () => {
    if (!hero) return;
    const { error } = await supabase.from("site_hero").update({
      full_name: hero.full_name, tagline: hero.tagline, location: hero.location,
      email: hero.email, phone: hero.phone, linkedin_url: hero.linkedin_url, github_url: hero.github_url,
      photo_url: hero.photo_url, resume_url: hero.resume_url,
      twitter_url: hero.twitter_url, instagram_url: hero.instagram_url,
      youtube_url: hero.youtube_url, website_url: hero.website_url,
      kaggle_url: hero.kaggle_url, other_url: hero.other_url, other_url_label: hero.other_url_label,
    } as any).eq("id", hero.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Hero updated!" }); invalidateAll(); }
  };

  const uploadHeroPhoto = async (file: File) => {
    setPhotoUploading(true);
    const ext = file.name.split('.').pop();
    const path = `hero-photo.${ext}`;
    const { error } = await supabase.storage.from("profile-photos").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); setPhotoUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("profile-photos").getPublicUrl(path);
    const url = publicUrl + "?t=" + Date.now();
    await (supabase as any).from("site_hero").update({ photo_url: url }).eq("id", hero.id);
    setHero({ ...hero, photo_url: url });
    invalidateAll();
    toast({ title: "Photo uploaded!" });
    setPhotoUploading(false);
  };

  const removeHeroPhoto = async () => {
    await (supabase as any).from("site_hero").update({ photo_url: "" }).eq("id", hero.id);
    setHero({ ...hero, photo_url: "" });
    invalidateAll();
    toast({ title: "Photo removed" });
  };

  const uploadResume = async (file: File) => {
    setResumeUploading(true);
    const ext = file.name.split('.').pop();
    const path = `resume.${ext}`;
    const { error } = await supabase.storage.from("resumes").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); setResumeUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("resumes").getPublicUrl(path);
    const url = publicUrl + "?t=" + Date.now();
    await (supabase as any).from("site_hero").update({ resume_url: url }).eq("id", hero.id);
    setHero({ ...hero, resume_url: url });
    invalidateAll();
    toast({ title: "Resume uploaded!" });
    setResumeUploading(false);
  };

  const removeResume = async () => {
    await (supabase as any).from("site_hero").update({ resume_url: "" }).eq("id", hero.id);
    setHero({ ...hero, resume_url: "" });
    invalidateAll();
    toast({ title: "Resume removed" });
  };

  const addExperience = async () => {
    if (!newExp.company || !newExp.role || !newExp.period) return;
    await supabase.from("site_experiences").insert({ ...newExp, sort_order: experiences.length });
    setNewExp({ company: "", role: "", period: "", location: "" }); loadAll(); invalidateAll(); toast({ title: "Added!" });
  };

  const addEducation = async () => {
    if (!newEdu.institution || !newEdu.degree || !newEdu.period) return;
    await supabase.from("site_education").insert({ ...newEdu, sort_order: education.length });
    setNewEdu({ institution: "", degree: "", period: "" }); loadAll(); invalidateAll(); toast({ title: "Added!" });
  };

  const addSkill = async () => {
    if (!newSkill.trim()) return;
    await supabase.from("site_skills").insert({ name: newSkill.trim(), sort_order: skills.length });
    setNewSkill(""); loadAll(); invalidateAll(); toast({ title: "Added!" });
  };

  const addCertification = async () => {
    if (!newCert.trim()) return;
    await supabase.from("site_certifications").insert({ name: newCert.trim(), sort_order: certifications.length });
    setNewCert(""); loadAll(); invalidateAll(); toast({ title: "Added!" });
  };

  const uploadCertImage = async (certId: string, file: File) => {
    const ext = file.name.split('.').pop();
    const path = `${certId}.${ext}`;
    const { error } = await supabase.storage.from("certificates").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return; }
    const { data: { publicUrl } } = supabase.storage.from("certificates").getPublicUrl(path);
    await supabase.from("site_certifications").update({ image_url: publicUrl } as any).eq("id", certId);
    loadAll(); invalidateAll(); toast({ title: "Image uploaded!" });
  };

  const addProject = async () => {
    if (!newProject.title.trim()) return;
    const bullets = newProject.bullets.split("\n").filter(b => b.trim());
    await supabase.from("site_projects").insert({
      title: newProject.title.trim(), bullets, sort_order: projects.length,
      project_url: newProject.project_url || "",
    } as any);
    setNewProject({ title: "", bullets: "", project_url: "" }); loadAll(); invalidateAll(); toast({ title: "Added!" });
  };

  const addStat = async () => {
    if (!newStat.value.trim() || !newStat.label.trim()) return;
    await (supabase as any).from("site_stats").insert({ icon: newStat.icon, value: newStat.value.trim(), label: newStat.label.trim(), sort_order: stats.length });
    setNewStat({ icon: "Award", value: "", label: "" }); loadAll(); invalidateAll(); toast({ title: "Added!" });
  };

  const deleteItem = async (table: string, id: string) => {
    await (supabase as any).from(table).delete().eq("id", id);
    loadAll(); invalidateAll();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={loadAll} className="gap-2"><RefreshCw className="h-4 w-4" /> Refresh</Button>
            <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-2"><LogOut className="h-4 w-4" /> Logout</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="flex flex-wrap gap-1">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="about">About Me</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="submissions">Submissions ({submissions.length})</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers ({subscribers.length})</TabsTrigger>
          </TabsList>

          {/* Hero Tab */}
          <TabsContent value="hero">
            <Card>
              <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {hero && (
                  <>
                    {/* Photo Upload */}
                    <div className="flex items-center gap-4 p-4 rounded-lg border border-border">
                      {hero.photo_url ? (
                        <img src={hero.photo_url} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-primary" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-xs">No photo</div>
                      )}
                      <div className="flex flex-col gap-2">
                        <label className="cursor-pointer">
                          <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadHeroPhoto(f); }} />
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer">
                            <Upload className="h-4 w-4" /> {photoUploading ? "Uploading..." : "Upload Photo"}
                          </span>
                        </label>
                        {hero.photo_url && (
                          <Button variant="destructive" size="sm" onClick={removeHeroPhoto} className="gap-1 w-fit">
                            <Trash2 className="h-3 w-3" /> Remove Photo
                          </Button>
                        )}
                      </div>
                    </div>
                    {/* Resume Upload */}
                    <div className="flex items-center gap-4 p-4 rounded-lg border border-border">
                      <div className="w-20 h-20 rounded-lg bg-secondary flex items-center justify-center">
                        <FileText className={`h-8 w-8 ${hero.resume_url ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-foreground">Resume / CV</p>
                        {hero.resume_url && (
                          <a href={hero.resume_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">View current resume</a>
                        )}
                        <label className="cursor-pointer">
                          <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadResume(f); }} />
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer">
                            <Upload className="h-4 w-4" /> {resumeUploading ? "Uploading..." : "Upload Resume"}
                          </span>
                        </label>
                        {hero.resume_url && (
                          <Button variant="destructive" size="sm" onClick={removeResume} className="gap-1 w-fit">
                            <Trash2 className="h-3 w-3" /> Remove Resume
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { label: "Full Name", key: "full_name" },
                        { label: "Location", key: "location" },
                        { label: "Email", key: "email" },
                        { label: "Phone", key: "phone" },
                        { label: "LinkedIn URL", key: "linkedin_url" },
                        { label: "GitHub URL", key: "github_url" },
                        { label: "Twitter/X URL", key: "twitter_url" },
                        { label: "Instagram URL", key: "instagram_url" },
                        { label: "YouTube URL", key: "youtube_url" },
                        { label: "Kaggle URL", key: "kaggle_url" },
                        { label: "Website URL", key: "website_url" },
                        { label: "Other URL", key: "other_url" },
                        { label: "Other URL Label", key: "other_url_label" },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="text-sm font-medium text-foreground">{f.label}</label>
                          <Input value={hero[f.key] || ""} onChange={e => setHero({ ...hero, [f.key]: e.target.value })} />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Tagline</label>
                      <Textarea value={hero.tagline} onChange={e => setHero({ ...hero, tagline: e.target.value })} rows={3} />
                    </div>
                    <Button onClick={saveHero} className="gap-2"><Save className="h-4 w-4" /> Save Hero</Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience">
            <Card>
              <CardHeader><CardTitle>Experience (drag to reorder)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleReorder("site_experiences", experiences, setExperiences, e)}>
                  <SortableContext items={experiences.map(x => x.id)} strategy={verticalListSortingStrategy}>
                    {experiences.map(exp => (
                      <SortableItem key={exp.id} id={exp.id}>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <div>
                            <p className="font-semibold text-foreground">{exp.company}</p>
                            <p className="text-sm text-muted-foreground">{exp.role} • {exp.period}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => deleteItem("site_experiences", exp.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
                <div className="border-t border-border pt-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">Add New</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input placeholder="Company" value={newExp.company} onChange={e => setNewExp({ ...newExp, company: e.target.value })} />
                    <Input placeholder="Role" value={newExp.role} onChange={e => setNewExp({ ...newExp, role: e.target.value })} />
                    <Input placeholder="Period" value={newExp.period} onChange={e => setNewExp({ ...newExp, period: e.target.value })} />
                    <Input placeholder="Location" value={newExp.location} onChange={e => setNewExp({ ...newExp, location: e.target.value })} />
                  </div>
                  <Button onClick={addExperience} className="gap-2"><Plus className="h-4 w-4" /> Add Experience</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education">
            <Card>
              <CardHeader><CardTitle>Education (drag to reorder)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleReorder("site_education", education, setEducation, e)}>
                  <SortableContext items={education.map(x => x.id)} strategy={verticalListSortingStrategy}>
                    {education.map(edu => (
                      <SortableItem key={edu.id} id={edu.id}>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <div>
                            <p className="font-semibold text-foreground">{edu.institution}</p>
                            <p className="text-sm text-muted-foreground">{edu.degree} • {edu.period}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => deleteItem("site_education", edu.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
                <div className="border-t border-border pt-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">Add New</p>
                  <Input placeholder="Institution" value={newEdu.institution} onChange={e => setNewEdu({ ...newEdu, institution: e.target.value })} />
                  <Input placeholder="Degree" value={newEdu.degree} onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })} />
                  <Input placeholder="Period" value={newEdu.period} onChange={e => setNewEdu({ ...newEdu, period: e.target.value })} />
                  <Button onClick={addEducation} className="gap-2"><Plus className="h-4 w-4" /> Add Education</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <Card>
              <CardHeader><CardTitle>Skills (drag to reorder)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleReorder("site_skills", skills, setSkills, e)}>
                  <SortableContext items={skills.map(x => x.id)} strategy={verticalListSortingStrategy}>
                    {skills.map(s => (
                      <SortableItem key={s.id} id={s.id}>
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm">
                          {s.name}
                          <button onClick={() => deleteItem("site_skills", s.id)} className="ml-1 text-destructive hover:text-destructive/80"><X className="h-3 w-3" /></button>
                        </span>
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
                <div className="flex gap-2">
                  <Input placeholder="New skill" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill()} />
                  <Button onClick={addSkill} className="gap-2"><Plus className="h-4 w-4" /> Add</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications">
            <Card>
              <CardHeader><CardTitle>Certifications (drag to reorder)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleReorder("site_certifications", certifications, setCertifications, e)}>
                  <SortableContext items={certifications.map(x => x.id)} strategy={verticalListSortingStrategy}>
                    {certifications.map(c => (
                      <SortableItem key={c.id} id={c.id}>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{c.name}</p>
                            {(c as any).image_url && (
                              <img src={(c as any).image_url} alt={c.name} className="mt-2 h-16 rounded border border-border" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <label className="cursor-pointer">
                              <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadCertImage(c.id, f); }} />
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                                <Upload className="h-3 w-3" /> Image
                              </span>
                            </label>
                            <Button variant="ghost" size="icon" onClick={() => deleteItem("site_certifications", c.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
                <div className="flex gap-2">
                  <Input placeholder="New certification" value={newCert} onChange={e => setNewCert(e.target.value)} onKeyDown={e => e.key === "Enter" && addCertification()} />
                  <Button onClick={addCertification} className="gap-2"><Plus className="h-4 w-4" /> Add</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader><CardTitle>Projects (drag to reorder)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleReorder("site_projects", projects, setProjects, e)}>
                  <SortableContext items={projects.map(x => x.id)} strategy={verticalListSortingStrategy}>
                    {projects.map(p => (
                      <SortableItem key={p.id} id={p.id}>
                        <div className="flex items-start justify-between p-3 rounded-lg border border-border">
                          <div>
                            <p className="font-semibold text-foreground">{p.title}</p>
                            {(p as any).project_url && <p className="text-xs text-primary truncate">{(p as any).project_url}</p>}
                            {Array.isArray(p.bullets) && (p.bullets as string[]).map((b: string, i: number) => (
                              <p key={i} className="text-sm text-muted-foreground">• {b}</p>
                            ))}
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => deleteItem("site_projects", p.id)} className="text-destructive shrink-0"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
                <div className="border-t border-border pt-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">Add New Project</p>
                  <Input placeholder="Project Title" value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} />
                  <Input placeholder="Project URL (GitHub, demo, etc.)" value={newProject.project_url} onChange={e => setNewProject({ ...newProject, project_url: e.target.value })} />
                  <Textarea placeholder="Bullet points (one per line)" value={newProject.bullets} onChange={e => setNewProject({ ...newProject, bullets: e.target.value })} rows={4} />
                  <Button onClick={addProject} className="gap-2"><Plus className="h-4 w-4" /> Add Project</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <Card>
              <CardHeader><CardTitle>Stats Counters (drag to reorder)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleReorder("site_stats", stats, setStats, e)}>
                  <SortableContext items={stats.map(x => x.id)} strategy={verticalListSortingStrategy}>
                    {stats.map(s => (
                      <SortableItem key={s.id} id={s.id}>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <div>
                            <p className="font-semibold text-foreground">{s.value} — {s.label}</p>
                            <p className="text-xs text-muted-foreground">Icon: {s.icon}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => deleteItem("site_stats", s.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
                <div className="border-t border-border pt-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">Add New Stat</p>
                  <div className="grid md:grid-cols-3 gap-3">
                    <select
                      value={newStat.icon}
                      onChange={e => setNewStat({ ...newStat, icon: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                    >
                      {["Award", "Users", "FolderKanban", "Code", "BarChart3", "Briefcase", "GraduationCap", "Star"].map(ic => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                    <Input placeholder="Value (e.g. 10+)" value={newStat.value} onChange={e => setNewStat({ ...newStat, value: e.target.value })} />
                    <Input placeholder="Label (e.g. Projects)" value={newStat.label} onChange={e => setNewStat({ ...newStat, label: e.target.value })} />
                  </div>
                  <Button onClick={addStat} className="gap-2"><Plus className="h-4 w-4" /> Add Stat</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions">
            <Card>
              <CardHeader><CardTitle>Form Submissions ({submissions.length})</CardTitle></CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No submissions yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead>
                          <TableHead>Message</TableHead><TableHead>Date</TableHead><TableHead className="w-16">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map(sub => (
                          <TableRow key={sub.id}>
                            <TableCell className="font-medium">{sub.name}</TableCell>
                            <TableCell>{sub.email}</TableCell>
                            <TableCell>{sub.phone || "—"}</TableCell>
                            <TableCell className="max-w-xs truncate">{sub.message}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(sub.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Newsletter Subscribers Tab */}
          <TabsContent value="subscribers">
            <Card>
              <CardHeader><CardTitle>Newsletter Subscribers ({subscribers.length})</CardTitle></CardHeader>
              <CardContent>
                {subscribers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No subscribers yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="w-16">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscribers.map((sub: any) => (
                          <TableRow key={sub.id}>
                            <TableCell className="font-medium">{sub.email}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={async () => {
                                await (supabase as any).from("newsletter_subscribers").delete().eq("id", sub.id);
                                setSubscribers(prev => prev.filter((s: any) => s.id !== sub.id));
                                toast({ title: "Subscriber deleted" });
                              }} className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
