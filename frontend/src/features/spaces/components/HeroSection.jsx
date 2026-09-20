import SearchBar from "./SearchBar";
import SearchFilters from "./SearchFilters";
import "../style/hero.css";
import SpacesPage from "../pages/SpacesPage";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-container">

        {/* <SearchBar /> */}

        {/* <SearchFilters /> */}

        <SpacesPage />

      </div>
    </section>
  );
}