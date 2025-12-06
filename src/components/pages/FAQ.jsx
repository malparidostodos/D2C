import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
    Search,
    Calendar,
    User,
    Car,
    CreditCard,
    LayoutDashboard,
    Star,
    Wrench,
    Shield,
    Settings,
    Globe,
    HelpCircle,
    MoreHorizontal,
    Cpu,
    Lightbulb,
    ChevronRight,
    ArrowLeft,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import Header from '../layout/Header';
import Contact from '../pages/Contact';
import SEO from '../ui/SEO';

const FAQ = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [expandedQuestions, setExpandedQuestions] = useState({});

    const sections = [
        { id: 'booking', icon: Calendar, label: 'faq.sections.booking' },
        { id: 'account', icon: User, label: 'faq.sections.account' },
        { id: 'vehicles', icon: Car, label: 'faq.sections.vehicles' },
        { id: 'payments', icon: CreditCard, label: 'faq.sections.payments' },
        { id: 'dashboard', icon: LayoutDashboard, label: 'faq.sections.dashboard' },
        { id: 'reviews', icon: Star, label: 'faq.sections.reviews' },
        { id: 'technical', icon: Wrench, label: 'faq.sections.technical' },
        { id: 'privacy', icon: Shield, label: 'faq.sections.privacy' },
        { id: 'admin', icon: Settings, label: 'faq.sections.admin' },
        { id: 'language', icon: Globe, label: 'faq.sections.language' },
        { id: 'support', icon: HelpCircle, label: 'faq.sections.support' },
        { id: 'others', icon: MoreHorizontal, label: 'faq.sections.others' },
        { id: 'specific_technical', icon: Cpu, label: 'faq.sections.specific_technical' },
        { id: 'tips', icon: Lightbulb, label: 'faq.sections.tips' }
    ];

    const toggleQuestion = (questionIndex) => {
        setExpandedQuestions(prev => ({
            ...prev,
            [questionIndex]: !prev[questionIndex]
        }));
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setSelectedCategory(null); // Reset category when searching
    };

    const filteredQuestions = useMemo(() => {
        if (!searchQuery) return null;

        const allQuestions = [];
        sections.forEach(section => {
            const questions = t(`faq.questions.${section.id}`, { returnObjects: true });
            if (Array.isArray(questions)) {
                questions.forEach(q => {
                    if (
                        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
                    ) {
                        allQuestions.push({ ...q, category: section.label });
                    }
                });
            }
        });
        return allQuestions;
    }, [searchQuery, t]);

    const renderCategoryGrid = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => {
                const Icon = section.icon;
                return (
                    <button
                        key={section.id}
                        onClick={() => setSelectedCategory(section.id)}
                        className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col items-center text-center group"
                    >
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                            <Icon className="w-8 h-8 text-[#0046b8]" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {t(section.label)}
                        </h3>
                        <div className="flex items-center text-[#0046b8] font-medium mt-auto pt-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                            <span>{t('faq.view_articles')}</span>
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                    </button>
                );
            })}
        </div>
    );

    const renderQuestionList = (questions, categoryTitle) => (
        <div className="max-w-3xl mx-auto">
            {categoryTitle && (
                <div className="mb-8 flex items-center">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h2 className="text-3xl font-semibold text-gray-900">{categoryTitle}</h2>
                </div>
            )}

            <div className="space-y-4">
                {questions.map((q, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 hover:border-blue-200"
                    >
                        <button
                            onClick={() => toggleQuestion(index)}
                            className="w-full px-6 py-5 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-semibold text-lg text-gray-900 pr-8">{q.question}</span>
                            {expandedQuestions[index] ? (
                                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            )}
                        </button>

                        <div
                            className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${expandedQuestions[index] ? 'max-h-[500px] py-5 border-t border-gray-100' : 'max-h-0'
                                }`}
                        >
                            <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {q.answer}
                            </div>
                            {q.category && (
                                <div className="mt-4 pt-4 border-t border-gray-50 text-sm text-gray-400">
                                    {t('faq.in_category')} {t(q.category)}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {questions.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{t('faq.no_results_title')}</h3>
                    <p className="text-gray-500 mt-2">{t('faq.no_results_desc')}</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <SEO title={t('faq.title')} description={t('faq.subtitle')} />
            <Header theme="white" />

            {/* Hero Section with Search */}
            <div className="bg-[#0046b8] pt-40 pb-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
                        {t('faq.title')}
                    </h1>
                    <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
                        {t('faq.subtitle')}
                    </p>

                    <div className="relative max-w-2xl mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-6 w-6 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-12 pr-4 py-4 rounded-2xl border-0 text-gray-900 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-white/50 text-lg"
                            placeholder={t('faq.search_placeholder')}
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow px-4 sm:px-6 lg:px-8 py-16 -mt-8">
                <div className="max-w-7xl mx-auto">
                    {searchQuery ? (
                        renderQuestionList(filteredQuestions, `${t('faq.search_results')} "${searchQuery}"`)
                    ) : selectedCategory ? (
                        renderQuestionList(
                            t(`faq.questions.${selectedCategory}`, { returnObjects: true }) || [],
                            t(sections.find(s => s.id === selectedCategory)?.label)
                        )
                    ) : (
                        renderCategoryGrid()
                    )}
                </div>
            </main>

            <Contact />
        </div>
    );
};

export default FAQ;
