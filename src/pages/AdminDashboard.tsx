import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Trash2, RefreshCw, Shield, Plus, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Hero state
  const [hero, setHero] = useState<any>(null);

  // List states
  const [experiences, setExperiences] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  // New item forms
  const [newExp, setNewExp] = useState({ company: "", role: "", period: "", location: "" });
  const [newEdu, setNewEdu] = useState({ institution: "", degree: "", period: "" });
  const [newSkill, setNewSkill] = useState("");
  const [newCert, setNewCert] = useState("");
  const [newProject, setNewProject] = useState({ title: "", bullets: "" });

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
    const [sub, h, exp, edu, sk, cert, proj] = await Promise.all([
      supabase.from("submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("site_hero").select("*").limit(1).single(),
      supabase.from("site_experiences").select("*").order("sort_order"),
      supabase.from("site_education").select("*").order("sort_order"),
      supabase.from("site_skills").select("*").order("sort_order"),
      supabase.from("site_certifications").select("*").order("sort_order"),
      supabase.from("site_projects").select("*").order("sort_order"),
    ]);
    setSubmissions(sub.data || []);
    setHero(h.data);
    setExperiences(exp.data || []);
    setEducation(edu.data || []);
    setSkills(sk.data || []);
    setCertifications(cert.data || []);
    setProjects(proj.data || []);
    setLoading(false);
  };

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["site_hero"] });
    queryClient.invalidateQueries({ queryKey: ["site_experiences"] });
    queryClient.invalidateQueries({ queryKey: ["site_education"] });
    queryClient.invalidateQueries({ queryKey: ["site_skills"] });
    queryClient.invalidateQueries({ queryKey: ["site_certifications"] });
    queryClient.invalidateQueries({ queryKey: ["site_projects"] });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("submissions").delete().eq("id", id);
    if (error) toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
    else { setSubmissions((prev) => prev.filter((s) => s.id !== id)); toast({ title: "Deleted" }); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  // Hero save
  const saveHero = async () => {
    if (!hero) return;
    const { error } = await supabase.from("site_hero").update({
      full_name: hero.full_name,
      tagline: hero.tagline,
      location: hero.location,
      email: hero.email,
      phone: hero.phone,
      linkedin_url: hero.linkedin_url,
      github_url: hero.github_url,
    }).eq("id", hero.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Hero updated!" }); invalidateAll(); }
  };

  // Add experience
  const addExperience = async () => {
    if (!newExp.company || !newExp.role || !newExp.period) return;
    const { error } = await supabase.from("site_experiences").insert({ ...newExp, sort_order: experiences.length });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { setNewExp({ company: "", role: "", period: "", location: "" }); loadAll(); invalidateAll(); toast({ title: "Added!" }); }
  };

  const deleteExperience = async (id: string) => {
    await supabase.from("site_experiences").delete().eq("id", id);
    loadAll(); invalidateAll();
  };

  // Add education
  const addEducation = async () => {
    if (!newEdu.institution || !newEdu.degree || !newEdu.period) return;
    const { error } = await supabase.from("site_education").insert({ ...newEdu, sort_order: education.length });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { setNewEdu({ institution: "", degree: "", period: "" }); loadAll(); invalidateAll(); toast({ title: "Added!" }); }
  };

  const deleteEducation = async (id: string) => {
    await supabase.from("site_education").delete().eq("id", id);
    loadAll(); invalidateAll();
  };

  // Add skill
  const addSkill = async () => {
    if (!newSkill.trim()) return;
    await supabase.from("site_skills").insert({ name: newSkill.trim(), sort_order: skills.length });
    setNewSkill(""); loadAll(); invalidateAll(); toast({ title: "Added!" });
  };

  const deleteSkill = async (id: string) => {
    await supabase.from("site_skills").delete().eq("id", id);
    loadAll(); invalidateAll();
  };

  // Add certification
  const addCertification = async () => {
    if (!newCert.trim()) return;
    await supabase.from("site_certifications").insert({ name: newCert.trim(), sort_order: certifications.length });
    setNewCert(""); loadAll(); invalidateAll(); toast({ title: "Added!" });
  };

  const deleteCertification = async (id: string) => {
    await supabase.from("site_certifications").delete().eq("id", id);
    loadAll(); invalidateAll();
  };

  // Add project
  const addProject = async () => {
    if (!newProject.title.trim()) return;
    const bullets = newProject.bullets.split("\n").filter(b => b.trim());
    await supabase.from("site_projects").insert({ title: newProject.title.trim(), bullets, sort_order: projects.length });
    setNewProject({ title: "", bullets: "" }); loadAll(); invalidateAll(); toast({ title: "Added!" });
  };

  const deleteProject = async (id: string) => {
    await supabase.from("site_projects").delete().eq("id", id);
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
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="submissions">Submissions ({submissions.length})</TabsTrigger>
          </TabsList>

          {/* Hero Tab */}
          <TabsContent value="hero">
            <Card>
              <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {hero && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">Full Name</label>
                        <Input value={hero.full_name} onChange={e => setHero({ ...hero, full_name: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Location</label>
                        <Input value={hero.location} onChange={e => setHero({ ...hero, location: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <Input value={hero.email} onChange={e => setHero({ ...hero, email: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Phone</label>
                        <Input value={hero.phone || ""} onChange={e => setHero({ ...hero, phone: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">LinkedIn URL</label>
                        <Input value={hero.linkedin_url || ""} onChange={e => setHero({ ...hero, linkedin_url: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">GitHub URL</label>
                        <Input value={hero.github_url || ""} onChange={e => setHero({ ...hero, github_url: e.target.value })} />
                      </div>
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
              <CardHeader><CardTitle>Experience</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {experiences.map(exp => (
                  <div key={exp.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-semibold text-foreground">{exp.company}</p>
                      <p className="text-sm text-muted-foreground">{exp.role} • {exp.period}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteExperience(exp.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
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
              <CardHeader><CardTitle>Education</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-semibold text-foreground">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground">{edu.degree} • {edu.period}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteEducation(edu.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
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
              <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {skills.map(s => (
                    <span key={s.id} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm">
                      {s.name}
                      <button onClick={() => deleteSkill(s.id)} className="ml-1 text-destructive hover:text-destructive/80"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
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
              <CardHeader><CardTitle>Certifications</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {certifications.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <p className="text-sm text-foreground">{c.name}</p>
                    <Button variant="ghost" size="icon" onClick={() => deleteCertification(c.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
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
              <CardHeader><CardTitle>Projects</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {projects.map(p => (
                  <div key={p.id} className="flex items-start justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-semibold text-foreground">{p.title}</p>
                      {Array.isArray(p.bullets) && (p.bullets as string[]).map((b: string, i: number) => (
                        <p key={i} className="text-sm text-muted-foreground">• {b}</p>
                      ))}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteProject(p.id)} className="text-destructive shrink-0"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
                <div className="border-t border-border pt-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">Add New Project</p>
                  <Input placeholder="Project Title" value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} />
                  <Textarea placeholder="Bullet points (one per line)" value={newProject.bullets} onChange={e => setNewProject({ ...newProject, bullets: e.target.value })} rows={4} />
                  <Button onClick={addProject} className="gap-2"><Plus className="h-4 w-4" /> Add Project</Button>
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
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="w-16">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((sub) => (
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
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
