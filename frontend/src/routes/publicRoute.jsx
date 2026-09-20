import Navbar from "@/components/layout/Navbar"
import HeroSection from "@/features/spaces/components/HeroSection"

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
)

export { PublicLayout }