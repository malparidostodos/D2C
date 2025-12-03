import FlavorTitle from "./FlavorTitle";
import FlavorSlider from "./FlavorSlider";

const FlavorSection = () => {
    return (
        <section id="precios" className="flavor-section-wrapper overflow-hidden">
            <div className="flavor-section will-change-transform">
                <div className="flavor-scroll-container w-full h-full flex lg:flex-row flex-col items-center relative">
                    <div className="lg:w-[57%] flex-none h-80 lg:h-full md:mt-20 xl:mt-0">
                        <FlavorTitle />
                    </div>
                    <div className="h-full">
                        <FlavorSlider />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FlavorSection;
