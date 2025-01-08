import Banner from "./components/Banner";
import NavBar from "./components/NavBar";
import ProductCategorySection from "./components/ProductCategorySection";

export default function Home() {
  return (
    <div className="container mx-auto text-center">
      <NavBar />
      <Banner />

      <ProductCategorySection
        category="Fiction"
        title="নতুন প্রকাশিত বইসমূহ"
      />
      <ProductCategorySection
        category="Seerah"
        title="সিরাত বইসমূহ"
      />
      <ProductCategorySection
        category="Hadith"
        title="হাদিস বইসমূহ"
      />

      <ProductCategorySection
        category="Non-Fiction"
        title="Non-Fiction Books"
      />
    </div>
  );
}
