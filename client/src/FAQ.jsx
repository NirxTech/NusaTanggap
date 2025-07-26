import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'Apa itu NusaTanggap dan bagaimana cara kerjanya?',
      answer: 'NusaTanggap adalah platform digital yang memungkinkan warga melaporkan kerusakan fasilitas publik menggunakan teknologi AI dan GPS. Cukup ambil foto kerusakan, sistem AI akan mendeteksi jenis masalah secara otomatis, lalu laporan akan dikirim ke instansi pemerintah terkait.',
    },
    {
      question: 'Apakah aplikasi ini gratis untuk digunakan?',
      answer: 'Ya, NusaTanggap sepenuhnya gratis untuk semua warga Indonesia. Kami berkomitmen menyediakan layanan public tanpa biaya untuk mendukung partisipasi aktif masyarakat dalam pembangunan.',
    },
    {
      question: 'Bagaimana keamanan data pribadi saya dijamin?',
      answer: 'Data Anda dilindungi dengan enkripsi tingkat militer dan disimpan di server yang aman. Kami hanya menggunakan data lokasi dan foto untuk keperluan pelaporan, dan tidak membagikan informasi pribadi kepada pihak ketiga.',
    },
    {
      question: 'Berapa lama laporan saya akan direspon?',
      answer: 'Laporan biasanya diverifikasi dalam 24 jam dan diteruskan ke instansi terkait dalam 2-3 hari kerja. Anda akan mendapat notifikasi tentang status penanganan laporan melalui aplikasi.',
    },
    {
      question: 'Jenis kerusakan apa saja yang bisa dilaporkan?',
      answer: 'Anda dapat melaporkan berbagai kerusakan seperti jalan berlubang, lampu jalan mati, fasilitas rusak di taman, kerusakan trotoar, masalah drainase, dan fasilitas publik lainnya yang memerlukan perbaikan.',
    },
    {
      question: 'Apakah saya bisa melacak status laporan yang sudah dikirim?',
      answer: 'Tentu! Setiap laporan memiliki nomor tracking yang dapat Anda gunakan untuk memantau progress penanganan. Anda juga akan mendapat update otomatis melalui notifikasi push dan email.',
    },
    {
      question: 'Bagaimana jika lokasi GPS tidak akurat?',
      answer: 'Jika GPS tidak akurat, Anda dapat menyesuaikan lokasi secara manual dengan mengetuk peta. Sistem juga dilengkapi dengan verifikasi alamat dan landmark terdekat untuk memastikan akurasi lokasi laporan.',
    },
    {
      question: 'Apakah bisa melaporkan tanpa menggunakan foto?',
      answer: 'Foto sangat direkomendasikan untuk membantu AI mendeteksi masalah dan mempercepat proses verifikasi. Namun, Anda tetap bisa membuat laporan dengan deskripsi detail jika tidak memungkinkan mengambil foto.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-xl text-gray-600">
            Temukan jawaban untuk pertanyaan umum seputar NusaTanggap
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-100 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Masih ada pertanyaan lain?
          </p>
          <a 
            href="https://mail.google.com/mail/?view=cm&fs=1&to=nusatanggap@gmail.com&su=Permintaan%20Informasi&body=Halo%20tim%20NusaTanggap%2C%20saya%20ingin%20bertanya%20tentang..."
            target='_blank'
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
          >
            Hubungi Tim Support
          </a>
        </div>
      </div>
    </section>
  );
}