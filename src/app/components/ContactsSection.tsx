'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  User, 
  MessageSquare,
  Facebook,
  Instagram,
  Youtube,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const ContactsSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Kļūda sūtot ziņu');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Kļūda sūtot ziņu. Pārbaudiet interneta savienojumu.');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'E-pasts',
      details: 'imants@sdkthunder.com',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'E-pasts',
      details: 'andrejs@sdkthunder.com',
      color: 'from-red-500 to-red-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-red-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0zm15 30L30 15 15 30l15 15 15-15zm-15-9l9 9-9 9-9-9 9-9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Sazinies ar </span>
            <span className="text-red-500 relative">
              mums
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-orange-400 rounded-full" />
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Mums ir svarīgi dzirdēt tavu viedokli! Sazinies ar mums par jebkuru jautājumu
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="order-2 lg:order-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-white flex items-center">
                <MessageSquare className="w-6 h-6 mr-3 text-red-400" />
                Sūti mums ziņu
              </h3>

              {/* Status ziņas */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-green-100 font-medium">Ziņa veiksmīgi nosūtīta!</p>
                    <p className="text-green-200 text-sm mt-1">Mēs drīzumā ar jums sazināsimies.</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-red-100 font-medium">Kļūda!</p>
                    <p className="text-red-200 text-sm mt-1">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Vārds *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-400 transition-colors duration-300" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 focus:outline-none transition-all duration-300 disabled:opacity-50"
                        placeholder="Tavs vārds"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      E-pasts *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-400 transition-colors duration-300" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 focus:outline-none transition-all duration-300 disabled:opacity-50"
                        placeholder="tavs@epasts.lv"
                      />
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Temats
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 focus:outline-none transition-all duration-300 disabled:opacity-50"
                    placeholder="Ziņas temats"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ziņa *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    rows={5}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 focus:outline-none transition-all duration-300 resize-none disabled:opacity-50"
                    placeholder="Raksti savu ziņu šeit..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sūta ziņu...
                      </>
                    ) : (
                      <>
                        Nosūtīt ziņu
                        <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="group">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] shadow-lg">
                    <div className="flex items-start">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${info.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {info.icon}
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-lg font-bold text-white mb-1">
                          {info.title}
                        </h4>
                        <p className="text-gray-200 font-medium mb-1">
                          {info.details}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                <span>Seko mums</span>
              </h4>
              <div className="flex gap-4">
                {[
                  { icon: <Facebook className="w-6 h-6" />, name: 'Facebook', color: 'hover:bg-blue-600' },
                  { icon: <Instagram className="w-6 h-6" />, name: 'Instagram', color: 'hover:bg-gradient-to-r hover:from-pink-500 hover:to-yellow-500' },
                  { icon: <Youtube className="w-6 h-6" />, name: 'YouTube', color: 'hover:bg-red-600' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg group`}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactsSection;