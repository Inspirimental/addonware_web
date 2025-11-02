import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ChevronRight, User, LogOut, ArrowRight } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { navItems } from "@/config/navigation";

interface NavigationProps {
  onConfiguratorOpen?: () => void;
}

export const Navigation = ({ onConfiguratorOpen }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
  const { user, profile, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border" role="navigation" aria-label="Hauptnavigation">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex flex-col">
            <Link to="/" className="flex items-center">
              <svg viewBox="0 0 160 32" className="w-[120px] h-6 md:w-[160px] md:h-8 text-primary">
                <text 
                  x="0" 
                  y="24" 
                  fill="currentColor" 
                  fontSize="24" 
                  fontWeight="bold" 
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  addonware
                </text>
              </svg>
            </Link>
            <span className="text-[8px] text-muted-foreground hidden sm:block leading-none">
              Digital. Strategisch. Menschlich.
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.submenu ? (
                  <>
                    <Link
                      to={item.href}
                      className="inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                    >
                      {item.label}
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </Link>
                    <div className="absolute top-full left-0 z-50 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-popover border rounded-md shadow-lg">
                      <div className="p-2">
                        {item.submenu.map((subItem) => (
                          subItem.divider ? (
                            <div key={subItem.href} className="my-2 border-t border-border" />
                          ) : (
                            <Link
                              key={subItem.href}
                              to={subItem.href}
                              className="block px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-popover-foreground"
                            >
                              {subItem.label}
                            </Link>
                          )
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className="inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Auth Menu - Only show if user is logged in */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-4">
                    <User className="w-4 h-4 mr-2" />
                    {profile?.role === 'admin' ? 'Admin' : 'Profil'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full">
                      <User className="w-4 h-4 mr-2" />
                      Mein Profil
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="w-full">
                        <ChevronRight className="w-4 h-4 mr-2" />
                        Admin-Bereich
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Abmelden
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {onConfiguratorOpen && (
              <Button onClick={onConfiguratorOpen} size="sm">
                Reifegrad-Check <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => setExpandedMobileItem(
                          expandedMobileItem === item.label ? null : item.label
                        )}
                        className="flex items-center justify-between w-full px-2 py-2 text-left text-foreground hover:text-primary transition-colors"
                      >
                        {item.label}
                        <ChevronRight 
                          className={`w-4 h-4 transition-transform ${
                            expandedMobileItem === item.label ? 'rotate-90' : ''
                          }`} 
                        />
                      </button>
                      {expandedMobileItem === item.label && (
                        <div className="ml-4 space-y-2 bg-muted/30 rounded-md p-3">
                          {item.submenu.map((subItem) => (
                            subItem.divider ? (
                              <div key={subItem.href} className="my-2 border-t border-border" />
                            ) : (
                              <Link
                                key={subItem.href}
                                to={subItem.href}
                                onClick={() => {
                                  setIsMobileMenuOpen(false);
                                  setExpandedMobileItem(null);
                                }}
                                className="block px-2 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                              >
                                {subItem.label}
                              </Link>
                            )
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-2 py-2 text-foreground hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Mobile Auth Section - Only show if user is logged in */}
              {user && (
                <div className="pt-2 border-t border-border space-y-1">
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-2 py-2 text-foreground hover:text-primary transition-colors"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Mein Profil
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center px-2 py-2 text-foreground hover:text-primary transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 mr-2" />
                      Admin-Bereich
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-2 py-2 text-left text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Abmelden
                  </button>
                </div>
              )}
              
              {onConfiguratorOpen && (
                <div className="pt-2">
                  <Button onClick={onConfiguratorOpen} size="sm" className="w-full">
                    Reifegrad-Check <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};