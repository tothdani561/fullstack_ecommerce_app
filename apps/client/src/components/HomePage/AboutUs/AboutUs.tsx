const AboutUs = () => {
    return (
        <div className="container mx-auto px-4 lg:px-10 py-10 mb-8 scroll-mt-20" id="about">
            <h2 className="text-center text-4xl font-bold text-pink-600 mb-6">
                Rólunk
            </h2>

            <div className="flex flex-col lg:flex-row items-center lg:items-center gap-10">
                <div className="lg:w-1/2 text-left self-center">
                    <p className="text-lg font-semibold text-pink-600 mb-2">
                        Szeretettel köszöntök minden látogatót!
                    </p>
                    <p className="text-gray-700 mb-4">
                        Szabó Emese vagyok, Gyulán élek. Mestervirágkötőként, dekoratőrként és ékszervarázslóként dolgozom jelenleg. Virágkötő szakoktatóként tevékenykedtem mintegy 20 évig középiskolában. Diákjaimmal rengeteg országos és nemzetköz versenyen szerepeltünk dobógos helyeken szinte mindig. Imádtam,de sajnos itt is csökkent a tanulólétszám, a nappali oktatás megszünt...remélem, nem örökre.
                        Honnan is az ékszer? Immár több, mint 15 éve jött a gondolat, amikor megláttam egy színes drótot. Számomra gyönyörű felülete, színe volt, és ahogy megcsillant rajta a fény....Beleszerettem....kezdetben csak én... Az ismerőseim úgy néztek rám,mint egy kínaira, hogy mi ez? Drótot teszek a nyakamba??? Micsoda ötlet ez? ! Aztán sok-sok utánajárás , rengeteg kisérletezés és most itt tartok. A kezdetekben kétkedők is nézőpontot váltottak és mostmár imádják az ékszereim. Sok időt töltöttem (éveket!!!! ) teszteléssel, hogy mások számára is viselhetők és tartósak ezek a művek,de ma már nem kételkedem.
                        Megszületett a kezeim között egy olyan dróttekerési technika, ami önmagában is egyedi, saját szellemi termék. Elneveztem "drótvarázs technikának". Így születtek meg a Drótvarázs Ékszerek.
                        Minden ékszer egyedi, megismételhetetlen!!! Tehát aki két egyformát szeretne, sajnos tovább kell keresgéljen!
                    </p>
                    <p className="text-gray-700">
                        Szeretettel látok mindenkit, aki szereti a minőséget, a szépet, az egyedit!
                    </p>
                </div>

                <div className="lg:w-1/2 flex justify-center">
                    <img 
                        src="/csokor.jpg" 
                        alt="Drótvarázs Ékszer és Virág" 
                        className="rounded-3xl shadow-md w-[80%] sm:w-[60%] md:w-[50%] lg:w-[80%]"
                    />
                </div>
            </div>
        </div>
    );
};

export default AboutUs;