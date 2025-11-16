import React, { useState } from 'react';
import { MessageSquare, Star, Calendar, User } from 'lucide-react';

const ConsultationExpert = () => {
  const [selectedExpert, setSelectedExpert] = useState<number | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookings, setBookings] = useState([
    {
      id: 1,
      expertName: 'Nizar Fathun Nazar',
      date: '2025-01-15',
      time: '14:00',
      type: 'Video Call',
      status: 'confirmed',
    },
  ]);

  const experts = [
    {
      id: 1,
      name: 'Nizar Fathun Nazar',
      title: 'Senior Digital Marketing Strategist',
      experience: '8+ tahun',
      rating: 4.9,
      reviews: 127,
      specialties: ['Social Media Marketing', 'Content Strategy', 'Paid Advertising'],
      price: 'Rp 150.000/jam',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      available: true,
    },
    {
      id: 2,
      name: 'Khairunisa Wahyu H',
      title: 'E-commerce Marketing Expert',
      experience: '6+ tahun',
      rating: 4.8,
      reviews: 89,
      specialties: ['E-commerce', 'Conversion Optimization', 'Analytics'],
      price: 'Rp 125.000/jam',
      avatar:
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      available: true,
    },
    {
      id: 3,
      name: 'Nana Andyana',
      title: 'Content Creator & Influencer Marketing',
      experience: '5+ tahun',
      rating: 4.7,
      reviews: 156,
      specialties: ['Content Creation', 'Influencer Marketing', 'Brand Partnerships'],
      price: 'Rp 100.000/jam',
      avatar:
        'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      available: false,
    },
  ];

  const handleBookConsultation = (expertId: number) => {
    setSelectedExpert(expertId);
    setShowBookingModal(true);
  };

  const handleSaveBooking = (bookingData: any) => {
    const expert = experts.find((e) => e.id === selectedExpert);
    const newBooking = {
      id: Date.now(),
      expertName: expert?.name || '',
      ...bookingData,
      status: 'confirmed',
    };
    setBookings([...bookings, newBooking]);
    setShowBookingModal(false);
  };

  const handleCancelBooking = (bookingId: number) => {
    setBookings(bookings.filter((booking) => booking.id !== bookingId));
  };

  return (
    <div className="p-4 md:p-8 space-y-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <MessageSquare className="h-10 w-10 text-blue-600" />
          Consultation Expert
        </h1>
        <p className="text-gray-500 text-lg">
          Konsultasi dengan pakar digital marketing untuk mengoptimalkan strategi bisnis Anda.
        </p>
      </div>

     {/* My Bookings */}
{bookings.length > 0 && (
  <div className="backdrop-blur-xl bg-white/60 border border-white/40 shadow-xl rounded-2xl p-6">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">Jadwal Konsultasi Saya</h3>

    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl bg-gradient-to-r from-blue-50 to-white shadow-sm border border-blue-100 gap-3"
        >
          {/* Left: Info */}
          <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
            <div className="p-3 bg-blue-100 rounded-xl flex-shrink-0">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{booking.expertName}</p>
              <p className="text-sm text-gray-600 truncate">
                {new Date(booking.date).toLocaleDateString('id-ID')} - {booking.time} ({booking.type})
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 mt-2 sm:mt-0">
            <span className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full shrink-0">
              {booking.status === 'confirmed' ? 'Terkonfirmasi' : booking.status}
            </span>

            <button
              onClick={() => handleCancelBooking(booking.id)}
              className="px-3 py-1 text-sm text-red-700 bg-red-100 rounded-full hover:bg-red-200 transition shrink-0"
            >
              Batalkan
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}


      {/* Expert Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {experts.map((expert) => (
          <div
            key={expert.id}
            className="relative bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6"
          >
            {/* Expert Header */}
            <div className="flex items-start gap-4">
              <img
                src={expert.avatar}
                alt={expert.name}
                className="w-20 h-20 rounded-full object-cover shadow-md"
              />

              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{expert.name}</h3>
                <p className="text-sm text-gray-600">{expert.title}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{expert.rating}</span>
                  <span className="text-sm text-gray-500">({expert.reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{expert.experience} pengalaman</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {expert.specialties.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Price + CTA */}
            <div className="mt-6 flex justify-between items-center border-t pt-4">
              <div>
                <p className="font-bold text-gray-900">{expert.price}</p>
                <p
                  className={`text-sm ${
                    expert.available ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {expert.available ? 'Tersedia' : 'Tidak Tersedia'}
                </p>
              </div>

              <button
                onClick={() => handleBookConsultation(expert.id)}
                disabled={!expert.available}
                className={`px-4 py-2 rounded-xl font-medium transition-all shadow-md ${
                  expert.available
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Booking Konsultasi</h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleSaveBooking({
                  date: formData.get('date'),
                  time: formData.get('time'),
                  type: formData.get('type'),
                });
              }}
              className="p-6 space-y-4"
            >
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waktu
                </label>
                <input
                  type="time"
                  name="time"
                  required
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Konsultasi
                </label>
                <select
                  name="type"
                  required
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Video Call">Video Call</option>
                  <option value="Phone Call">Telepon</option>
                  <option value="In Person">Tatap Muka</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-3 border rounded-lg hover:bg-gray-100 transition"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Konfirmasi Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationExpert;
