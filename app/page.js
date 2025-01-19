import Banner from "./components/Banner";
import NavBar from "./components/NavBar";
import ProductCategorySection from "./components/ProductCategorySection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="container mx-auto text-center">
      <NavBar />
      <Banner />

      <ProductCategorySection
        category=""
        title="নতুন প্রকাশিত বইসমূহ"
      />

      <ProductCategorySection
        category="তাওহীদ"
        title="তাওহীদ বইসমূহ"
      />
      <ProductCategorySection
        category="সিরাত"
        title="সিরাত বইসমূহ"
      />
      <ProductCategorySection
        category="হাদিস"
        title="হাদিস বইসমূহ"
      />

      <ProductCategorySection
        category=""
        title="সর্বশেষ বইসমূহ"
      />
      <Footer />
    </div>
  );
}
