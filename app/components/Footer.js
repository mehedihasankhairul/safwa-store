import React from 'react';

const Footer = () => (
  <footer className="bg-gray-800 text-white py-12">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* About Us */}
      <div>
        <h3 className="text-xl font-bold mb-4">প্রতিষ্ঠানিক লক্ষ্য</h3>
        <p className="text-sm leading-relaxed">
          ইসলামি বই কেনার অভিজ্ঞতা নতুন করে রচনা করুন। কোরআন ও সুন্নাহ্‌র আলোকে সহজভাবে বুঝে জানুন ইসলামের সঠিক জ্ঞান।
        </p>
      </div>
      {/* Contact */}
      <div>
        <h3 className="text-xl font-bold mb-4">যোগাযোগ</h3>
        <p className="text-sm">ঠিকানা: হেড অফিস, বক্সিরমোর মোড়, চাঁপাইনবাবগঞ্জ, ৬৩০০</p>
        <p className="text-sm">ফোন: +880170000000</p>
        <p className="text-sm">ইমেল: contact@ikhistaaore.com</p>
        <p className="text-sm">খোলা সময়: (৯:০০AM - ১০:০০PM)</p>
      </div>
      {/* Quick Links */}
      <div>
        <h3 className="text-xl font-bold mb-4">দ্রুত সংযোগ</h3>
        <ul className="text-sm space-y-2">
          <li><a href="#" className="hover:text-red-400">হোম</a></li>
          <li><a href="#" className="hover:text-red-400">বই সমূহ</a></li>
          <li><a href="#" className="hover:text-red-400">যোগাযোগ</a></li>
          <li><a href="#" className="hover:text-red-400">প্রাইভেসি পলিসি</a></li>
        </ul>
      </div>
      {/* Social Media */}
      <div>
        <h3 className="text-xl font-bold mb-4">অনুসরণ করুন</h3>
        <div className="space-x-4">
          <a href="#" className="text-2xl hover:text-red-400">🔗</a>
          <a href="#" className="text-2xl hover:text-red-400">🔗</a>
          <a href="#" className="text-2xl hover:text-red-400">🔗</a>
        </div>
        <p className="mt-4 text-sm">© 2025 ইখলাস স্টোর. সর্বস্বত্ব সংরক্ষিত.</p>
      </div>
    </div>
  </footer>
)

export default Footer;
