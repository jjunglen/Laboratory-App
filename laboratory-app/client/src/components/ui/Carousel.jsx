import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const CarouselContext = React.createContext(null)

function useCarousel() {
    const context = React.useContext(CarouselContext)
    if (!context) throw new Error("useCarousel must be used within a <Carousel />")
    return context
}

function Carousel({ orientation = "horizontal", opts, plugins, className = "", children, ...props }) {
    const [carouselRef, api] = useEmblaCarousel(
        { ...opts, axis: orientation === "horizontal" ? "x" : "y" },
        plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api) => {
        if (!api) return
        setCanScrollPrev(api.canScrollPrev())
        setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api])
    const scrollNext = React.useCallback(() => api?.scrollNext(), [api])

    const handleKeyDown = React.useCallback((event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); scrollPrev() }
        else if (event.key === "ArrowRight") { event.preventDefault(); scrollNext() }
    }, [scrollPrev, scrollNext])

    React.useEffect(() => {
        if (!api) return
        onSelect(api)
        api.on("reInit", onSelect)
        api.on("select", onSelect)
        return () => { api?.off("select", onSelect) }
    }, [api, onSelect])

  return (
    <CarouselContext.Provider value={{ carouselRef, api, opts, orientation, scrollPrev, scrollNext, canScrollPrev, canScrollNext }}>
        <div onKeyDownCapture={handleKeyDown} className={`relative ${className}`} role="region" aria-roledescription="carousel" {...props}>
            {children}
        </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className = "", ...props }) {
    const { carouselRef, orientation } = useCarousel()
    return (
        <div ref={carouselRef} className="overflow-hidden">
        <div className={`flex ${orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col"} ${className}`} {...props} />
        </div>
    )
}

function CarouselItem({ className = "", ...props }) {
    const { orientation } = useCarousel()
    return (
        <div
        role="group"
        aria-roledescription="slide"
        className={`min-w-0 shrink-0 grow-0 basis-full ${orientation === "horizontal" ? "pl-4" : "pt-4"} ${className}`}
        {...props}
        />
    )
}

function CarouselPrevious({ className = "", ...props }) {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel()
    return (
        <button
        className={`absolute w-8 h-8 rounded-full flex items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${
            orientation === "horizontal" ? "top-1/2 left-2 -translate-y-1/2" : "-top-10 left-1/2 -translate-x-1/2 rotate-90"
        } ${className}`}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
        >
        <ChevronLeft size={16} />
        </button>
    )
}

function CarouselNext({ className = "", ...props }) {
    const { orientation, scrollNext, canScrollNext } = useCarousel()
    return (
        <button
        className={`absolute w-8 h-8 rounded-full flex items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${
            orientation === "horizontal" ? "top-1/2 right-2 -translate-y-1/2" : "-bottom-10 left-1/2 -translate-x-1/2 rotate-90"
        } ${className}`}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
        >
        <ChevronRight size={16} />
        </button>
    )
}

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext }