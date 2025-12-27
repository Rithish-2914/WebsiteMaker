import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useSite } from "@/hooks/use-sites";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface SiteCardProps {
  id: number;
}

export function SiteCard({ id }: SiteCardProps) {
  const { data: site, isLoading } = useSite(id);

  if (isLoading) {
    return (
      <Card className="animate-pulse bg-muted/50 border-transparent shadow-none">
        <CardContent className="h-48 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!site) return null;

  const getStatusIcon = () => {
    switch (site.status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (site.status) {
      case "completed":
        return "Ready to view";
      case "failed":
        return "Generation failed";
      default:
        return "Generating your site...";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-white/50 backdrop-blur-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
        <CardHeader className="bg-gradient-to-br from-white to-secondary/30 pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="line-clamp-1 text-lg group-hover:text-primary transition-colors">
                {site.prompt.slice(0, 30)}...
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                {site.createdAt ? format(new Date(site.createdAt), "MMM d, h:mm a") : "Just now"}
              </CardDescription>
            </div>
            {getStatusIcon()}
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            "{site.prompt}"
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm font-medium">
             <span className={`
               px-2.5 py-0.5 rounded-full text-xs
               ${site.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
               ${site.status === 'pending' ? 'bg-blue-100 text-blue-700' : ''}
               ${site.status === 'failed' ? 'bg-red-100 text-red-700' : ''}
             `}>
               {getStatusText()}
             </span>
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-6">
          {site.status === "completed" ? (
            <a 
              href={`/sites/${site.id}/preview`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full"
            >
              <Button className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground">
                <ExternalLink className="w-4 h-4" />
                Open Website
              </Button>
            </a>
          ) : (
            <Button disabled variant="secondary" className="w-full gap-2">
              {site.status === "failed" ? "Retry later" : "Please wait..."}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
