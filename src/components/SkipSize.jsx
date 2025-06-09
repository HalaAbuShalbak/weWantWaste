import React, { Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SkipModal from './SkipModal'

const VAT_RATE = 20;



const SkipList = ({ skips, selectedSkipId, onSkipSelect }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skips.map((skip) => {
                const net = Number(skip.price_before_vat);
                const vat = net * (skip.vat / 100);
                const gross = net + vat;
                return (
                    <div
                        key={skip.id}
                        className={`relative rounded-xl overflow-hidden shadow-lg group min-h-[260px] flex items-end bg-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-2 hover:border-blue-400 active:scale-95 ${
                            selectedSkipId === skip.id ? 'ring-4 ring-blue-500' : ''
                        }`}
                        style={{
                            backgroundImage: `url('https://hermeq.com/media/amasty/amoptmobile/catalog/product/cache/7ae8b5fd60d2d07f1c6ab0ccf9a8cdfd/s/k/sk1040-4-yard-mini-builders-skip-open-chain-lift-yellow_01_jpg.webp')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                        onClick={() => onSkipSelect(skip)}
                    >
                        {/* Top-right icons */}
                        <div className="absolute top-3 right-3 flex gap-2 z-10">
                            {/* Allowed on Road Icon */}
                            <div className="bg-white p-1 rounded-full shadow flex items-center justify-center relative transform transition-transform duration-200 hover:scale-110" title={skip.allowed_on_road ? 'Allowed on Road' : 'Not Allowed on Road'}>
                                {/* Car icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${skip.allowed_on_road ? 'text-green-600' : 'text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13l2-5a2 2 0 012-2h10a2 2 0 012 2l2 5M5 13h14M7 16a1 1 0 11-2 0 1 1 0 012 0zm10 0a1 1 0 112 0 1 1 0 01-2 0z" />
                                </svg>
                                {!skip.allowed_on_road && (
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 24 24">
                                        <line x1="4" y1="20" x2="20" y2="4" stroke="red" strokeWidth="2" />
                                    </svg>
                                )}
                            </div>
                            {/* Heavy Waste Icon */}
                            <div className="bg-white p-1 rounded-full shadow flex items-center justify-center relative transform transition-transform duration-200 hover:scale-110" title={skip.allows_heavy_waste ? 'Allows Heavy Waste' : 'Does Not Allow Heavy Waste'}>
                                {/* Weight/Barbell icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${skip.allows_heavy_waste ? 'text-green-600' : 'text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <rect x="7" y="9" width="10" height="6" rx="2" fill="currentColor"/>
                                    <rect x="3" y="10" width="2" height="4" rx="1" fill="currentColor"/>
                                    <rect x="19" y="10" width="2" height="4" rx="1" fill="currentColor"/>
                                </svg>
                                {!skip.allows_heavy_waste && (
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 24 24">
                                        <line x1="4" y1="20" x2="20" y2="4" stroke="red" strokeWidth="2" />
                                    </svg>
                                )}
                            </div>
                        </div>

                        {/* Bottom content bar */}
                        <div className="w-full flex flex-col gap-1 px-4 py-3 bg-black/60 text-white text-base text-lg font-medium rounded-b-xl z-10 transform transition-transform duration-300 group-hover:translate-y-0">
                            <div className="flex justify-between items-center">
                                <span className="text-lg">{skip.size} Yards</span>
                                <span className="text-lg">£{gross.toFixed(2)} <span className="text-xs font-normal">/ {skip.hire_period_days} days</span></span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-200">
                            </div>
                        </div>

                        {/* Select button - visible on hover and mobile */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 md:opacity-0">
                            <button 
                                className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-200 font-semibold text-base hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                onClick={() => onSkipSelect(skip)}
                            >
                                {selectedSkipId === skip.id ? 'Deselect' : 'Select'}
                            </button>
                        </div>

                        {/* Mobile Select Button - Always visible on mobile */}
                        <div className="md:hidden absolute bottom-10 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20">
                            <button 
                                className="w-full bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg font-semibold text-base hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                                onClick={() => onSkipSelect(skip)}
                            >
                                {selectedSkipId === skip.id ? 'Deselect' : 'Select'}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

const LoadingFallback = () => <div className="text-center p-4">Loading skips...</div>

const fetchSkips = async () => {
    const response = await fetch("https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft")
    if (!response.ok) throw new Error('Failed to fetch skips')
    return response.json()
}

const SkipSize = () => {
    const navigate = useNavigate();
    const [skips, setSkips] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterRoad, setFilterRoad] = useState(false);
    const [filterHeavy, setFilterHeavy] = useState(false);
    const [selectedSkipId, setSelectedSkipId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedSkip, setSelectedSkip] = useState(null);

    useEffect(() => {
        const loadSkips = async () => {
            try {
                const data = await fetchSkips()
                setSkips(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setIsLoading(false)
            }
        }

        loadSkips()
    }, [])

    if (error) {
        return <div className="text-red-500 p-4">Error: {error}</div>
    }

    // Filtering
    let filteredSkips = skips.filter(skip => {
        if (filterRoad && !skip.allowed_on_road) return false;
        if (filterHeavy && !skip.allows_heavy_waste) return false;
        return true;
    });

    // Sorting
    filteredSkips = filteredSkips.sort((a, b) => {
        const aNet = Number(a.price_before_vat) * (1 + a.vat / 100);
        const bNet = Number(b.price_before_vat) * (1 + b.vat / 100);
        if (sortOrder === 'asc') return aNet - bNet;
        else return bNet - aNet;
    });

    const handleSkipSelect = (skip) => {
        if (selectedSkipId === skip.id) {
            setSelectedSkipId(null);
            setSelectedSkip(null);
            setShowModal(false);

        } else {
            setSelectedSkipId(skip.id);
            setSelectedSkip(skip);
            setShowModal(true);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleCheckout = () => {
        console.log('Proceeding to checkout with skip:', selectedSkip);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <div className="mb-4">
                <button
                    onClick={() => navigate('/waste-type')}
                    className="flex items-center gap-2 text-gray-900 hover:text-black font-meduim  hover:bg-blue-500 rounded-full px-4 py-2 transition-colors dark:text-white"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>
            </div>

            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-300 text-white shadow-lg flex flex-col items-center">
                <svg className="h-10 w-10 mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13l2-5a2 2 0 012-2h10a2 2 0 012 2l2 5" />
                    <circle cx="7" cy="16" r="1" />
                    <circle cx="17" cy="16" r="1" />
                </svg>
                <h2 className="text-3xl font-bold">Find Your Perfect Skip</h2>
                <p className="text-lg mt-2">Compare sizes, prices, and features. Filter and sort to get exactly what you need!</p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center mb-8 p-4 dark:bg-white bg-gray-900 rounded-xl shadow-md sticky top-0 z-20">
                {/* Filter Pills */}
                <button
                    className={`px-4 py-2 rounded-full border transition-all font-medium flex items-center gap-2
                        ${filterRoad ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                    onClick={() => setFilterRoad(v => !v)}
                    type="button"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13l2-5a2 2 0 012-2h10a2 2 0 012 2l2 5" />
                        <circle cx="7" cy="16" r="1" />
                        <circle cx="17" cy="16" r="1" />
                    </svg>
                    Allowed on Road
                </button>
                <button
                    className={`px-4 py-2 rounded-full border transition-all font-medium flex items-center gap-2
                        ${filterHeavy ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                    onClick={() => setFilterHeavy(v => !v)}
                    type="button"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <rect x="7" y="9" width="10" height="6" rx="2" stroke="currentColor" />
                        <rect x="3" y="10" width="2" height="4" rx="1" stroke="currentColor" />
                        <rect x="19" y="10" width="2" height="4" rx="1" stroke="currentColor" />
                    </svg>
                    Allows Heavy Waste
                </button>
                {/* Sort Dropdown */}
                <div className="relative">
                    <select
                        value={sortOrder}
                        onChange={e => setSortOrder(e.target.value)}
                        className="appearance-none px-4 py-2 rounded-full border border-gray-300 bg-gray-100 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all pr-10"
                    >
                        <option value="asc">Price: Low to High</option>
                        <option value="desc">Price: High to Low</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </span>  
                    {/* Clear Filters Button */}
                    {(filterRoad || filterHeavy || sortOrder !== 'asc') && (
                        <button
                            className="ml-2 p-2 rounded-full bg-gray-200 text-gray-700 border border-gray-300 hover:bg-red-100 hover:text-red-600 transition-all relative group"
                            onClick={() => {
                                setFilterRoad(false);
                                setFilterHeavy(false);
                                setSortOrder('asc');
                            }}
                            type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Clear Filters
                            </span>
                        </button>
                    )}
                </div> 
            </div>
            <div>
                <Suspense fallback={<LoadingFallback />}>
                    {isLoading ? (
                        <LoadingFallback />
                    ) : (
                        <SkipList 
                            skips={filteredSkips} 
                            selectedSkipId={selectedSkipId}
                            onSkipSelect={handleSkipSelect}
                        />
                    )}
                </Suspense>
            </div>

            {showModal && selectedSkip && (
                <SkipModal
                    skip={selectedSkip}
                    gross={Number(selectedSkip.price_before_vat) * (1 + selectedSkip.vat / 100)}
                    onClose={handleModalClose}
                    onCheckout={handleCheckout}
                />
            )}
        </div>
    )
}

export default SkipSize