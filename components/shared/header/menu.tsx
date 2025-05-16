import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MenuIcon, ShoppingCart } from "lucide-react"
import Link from "next/link"
import ModeToggle from "./mode-toggle"
// import UserButton from './user-button';

const Menu = () => {
  return (
    <div className="flex items-center justify-end w-auto">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-4">
        <Button asChild variant="ghost" size="sm" className="px-4">
          <Link href="/cart" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Cart</span>
          </Link>
        </Button>
        <div className="mx-1">
          <ModeToggle />
        </div>
        {/* <UserButton /> */}
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px]">
            <SheetHeader>
              <SheetTitle className="text-left mb-6">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6 mt-2">
              <Button asChild variant="ghost" className="justify-start px-2">
                <Link href="/cart" className="flex items-center gap-3">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Cart</span>
                </Link>
              </Button>
              <div className="px-2">
                <ModeToggle />
              </div>
              {/* <div className="px-2">
                <UserButton />
              </div> */}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default Menu
