import { Instagram, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="text-center">
        <h3 className="text-xl font-bold">Bannada Daara</h3>
        <p className="my-2">Adding color to your life 🌈</p>
        <div className="flex justify-center gap-6 my-4">
          <Instagram />
          <Phone />
          <Mail />
        </div>
        <p className="text-sm text-gray-400">
          © 2024 Bannada Daara. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
