import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Smile, Star, Quote, Coffee, Book, Zap, Sun } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Motivational",
    icon: Zap,
    count: 1250,
    color: "from-purple-500 to-pink-500",
    description: "Inspire and get inspired"
  },
  {
    name: "Love & Romance",
    icon: Heart,
    count: 892,
    color: "from-pink-500 to-red-500",
    description: "Express your feelings"
  },
  {
    name: "Funny",
    icon: Smile,
    count: 756,
    color: "from-yellow-500 to-orange-500",
    description: "Bring smiles and laughter"
  },
  {
    name: "Success",
    icon: Star,
    count: 634,
    color: "from-blue-500 to-cyan-500",
    description: "Celebrate achievements"
  },
  {
    name: "Life Quotes",
    icon: Quote,
    count: 543,
    color: "from-green-500 to-teal-500",
    description: "Wisdom for daily life"
  },
  {
    name: "Coffee",
    icon: Coffee,
    count: 432,
    color: "from-amber-600 to-yellow-500",
    description: "For coffee lovers"
  },
  {
    name: "Books",
    icon: Book,
    count: 321,
    color: "from-indigo-500 to-purple-500",
    description: "Literary inspiration"
  },
  {
    name: "Good Morning",
    icon: Sun,
    count: 287,
    color: "from-orange-500 to-pink-500",
    description: "Start your day right"
  },
  {
    name: "தமிழ்",
    icon: Quote,
    count: 156,
    color: "from-red-500 to-orange-500",
    description: "Tamil quotes and wisdom"
  }
];

const Categories = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Browse Categories
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find the perfect caption for every moment and mood
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link 
                  key={category.name}
                  to={`/category/${encodeURIComponent(category.name)}`}
                  className="block"
                >
                  <Card 
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-card bg-card/50 backdrop-blur-sm border-border/50 animate-fade-in"
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {category.description}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {category.count} captions
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;