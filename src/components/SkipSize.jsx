import React, { Suspense, useEffect, useState } from 'react'

const VAT_RATE = 20;

const SkipList = ({ skips }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skips.map((skip) => {
                const net = Number(skip.price_before_vat);
                const vat = net * (skip.vat / 100);
                const gross = net + vat;
                return (
                    <div
                        key={skip.id}
                        className="relative rounded-xl overflow-hidden shadow-lg group min-h-[260px] flex items-end bg-gray-200"
                        style={{
                            backgroundImage: `url('https://hermeq.com/media/amasty/amoptmobile/catalog/product/cache/7ae8b5fd60d2d07f1c6ab0ccf9a8cdfd/s/k/sk1040-4-yard-mini-builders-skip-open-chain-lift-yellow_01_jpg.webp')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {/* Top-right icons */}
                        <div className="absolute top-3 right-3 flex gap-2 z-10">
                            {/* Allowed on Road Icon */}
                            <div className="bg-white p-1 rounded-full shadow flex items-center justify-center relative" title={skip.allowed_on_road ? 'Allowed on Road' : 'Not Allowed on Road'}>
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
                            <div className="bg-white p-1 rounded-full shadow flex items-center justify-center relative" title={skip.allows_heavy_waste ? 'Allows Heavy Waste' : 'Does Not Allow Heavy Waste'}>
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
                        <div className="w-full flex flex-col gap-1 px-4 py-3 bg-black/60 text-white text-base font-medium rounded-b-xl z-10">
                            <div className="flex justify-between items-center">
                                <span>{skip.size} yards</span>
                                <span>£{gross.toFixed(2)} <span className="text-xs font-normal">/ 14 days hire</span></span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-200">
                            </div>
                        </div>

                        {/* Hover Select button */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-200 font-semibold text-base">
                                Select
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
    const [skips, setSkips] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterRoad, setFilterRoad] = useState(false);
    const [filterHeavy, setFilterHeavy] = useState(false);

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

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Choose Skip Size</h1>
            <div className="flex flex-wrap gap-4 justify-center mb-8 p-4 bg-white rounded-xl shadow-md">
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
                        className="ml-2 px-4 py-2 rounded-full bg-gray-200 text-gray-700 border border-gray-300 hover:bg-red-100 hover:text-red-600 font-medium transition-all"
                        onClick={() => {
                            setFilterRoad(false);
                            setFilterHeavy(false);
                            setSortOrder('asc');
                        }}
                        type="button"
                    >
                        Clear Filters
                    </button>
                )}
                </div> 
             
            </div>
            <Suspense fallback={<LoadingFallback />}>
                {isLoading ? (
                    <LoadingFallback />
                ) : (
                    <SkipList skips={filteredSkips} />
                )}
            </Suspense>
        </div>
    )
}

export default SkipSize