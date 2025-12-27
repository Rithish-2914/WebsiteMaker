import { useState, useEffect } from "react";
import { useCreateSite } from "@/hooks/use-sites";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteCard } from "@/components/site-card";
import { Wand2, Sparkles, MessageSquare, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  // Storing IDs locally since backend doesn't have list endpoint yet
  const [siteIds, setSiteIds] = useState<number[]>(() => {
    const saved = localStorage.getItem("siteIds");
    return saved ? JSON.parse(saved) : [];
  });

  const { mutate, isPending } = useCreateSite();
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("siteIds", JSON.stringify(siteIds));
  }, [siteIds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    mutate({ prompt }, {
      onSuccess: (site) => {
        setSiteIds(prev => [site.id, ...prev]);
        setPrompt("");
        toast({
          title: "Generating your website",
          description: "This usually takes about 30 seconds. Sit tight!",
        });
      },
      onError: () => {
        toast({
          title: "Something went wrong",
          description: "Could not start generation. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-background to-background dark:from-indigo-950/30">
      {/* Navbar */}
      <nav className="border-b bg-white/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Zap className="w-5 h-5 text-primary fill-primary/20" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">FlashWeb</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
            <span>Powered by GPT-4o</span>
            <div className="w-px h-4 bg-border" />
            <span>Instant Deployment</span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-foreground">
              Turn a <span className="text-primary bg-primary/5 px-2 rounded-lg inline-block">text message</span><br />
              into a <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">website</span>.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Describe your dream online store in plain English. AI writes the code, designs the layout, and deploys it in seconds.
            </p>
          </motion.div>

          {/* Input Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-white dark:bg-zinc-900 rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center px-4">
                  <MessageSquare className="w-5 h-5 text-muted-foreground mr-3" />
                  <Input 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g. 'A minimal streetwear brand with dark aesthetic'"
                    className="border-0 shadow-none focus-visible:ring-0 px-0 h-12 text-base bg-transparent"
                    disabled={isPending}
                  />
                </div>
                <Button 
                  size="lg" 
                  disabled={isPending || !prompt.trim()}
                  className="rounded-xl h-12 sm:w-auto w-full font-semibold shadow-none"
                >
                  {isPending ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Site
                    </>
                  )}
                </Button>
              </div>
            </form>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Try:</span>
              {["Vintage Denim Shop", "Organic Bakery", "Tech Startup Landing"].map((example) => (
                <button
                  key={example}
                  onClick={() => setPrompt(example)}
                  className="text-xs bg-white dark:bg-zinc-800 border rounded-full px-3 py-1 hover:border-primary hover:text-primary transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Generations */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-display font-bold">Recent Creations</h2>
            <span className="text-sm text-muted-foreground">{siteIds.length} projects</span>
          </div>
          
          {siteIds.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed">
              <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-4">
                <Wand2 className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium text-muted-foreground">No websites yet</h3>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Enter a prompt above to generate your first website.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {siteIds.map((id) => (
                  <SiteCard key={id} id={id} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
