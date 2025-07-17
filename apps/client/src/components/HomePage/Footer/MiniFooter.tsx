const MiniFooter = () => {
    return (
        <footer className="text-black pt-6">
            <div className="container mx-auto px-6">
                <div className="text-center text-sm pb-2">
                    <a href="https://www.barion.com/" target="_blank">
                        <img 
                            src="/barion-card-strip-intl_300px.png" 
                            alt="barion-card-strip" 
                            className="mb-2 mx-auto"
                        />
                    </a>

                    <div className="grid grid-cols-1 md:grid-cols-1 lg:flex lg:justify-center lg:items-center gap-3 md:gap-3 lg:gap-7">
                        <p className="text-center">Általános Szerződési feltételek</p>
                        <p className="text-center">Adatvédelmi nyilatkozat</p>
                        <p className="text-center">Cookie Tájékoztató</p>
                        <p className="text-center">Copyright © 2024 - 2025 - drotvarazs.hu | Minden jog fenntartva!</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default MiniFooter;