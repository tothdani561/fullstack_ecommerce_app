import { FaEnvelope } from "react-icons/fa";

const Footer = () => {
    return (
        <footer id="footer" className="bg-primary text-white pt-6">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-center">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Üzemeltető</h3>
                        <p>Drótvarázs Ékszer és Virág</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Elérhetőségek</h3>
                        <p className="flex justify-center items-center gap-2">
                            <FaEnvelope /> info@drotvarazs.com
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Dokumentumok</h3>
                        <ul>
                            <li><a href="#" className="hover:underline">Általános Szerződési Feltételek</a></li>
                            <li><a href="#" className="hover:underline">Adatvédelmi Nyilatkozat</a></li>
                            <li><a href="#" className="hover:underline">Cookie Tájékoztató</a></li>
                        </ul>
                    </div>
                </div>

                <div className="text-center text-sm mt-5 pb-2">
                    <a href="https://www.barion.com/" target="_blank"><img src="/barion-card-strip-intl_300px.png" alt="barion-card-strip" className="mb-2 mx-auto"/></a>
                    Copyright © 2024 - 2025 - drotvarazs.hu | Minden jog fenntartva! 
                </div>
            </div>
        </footer>
    );
};

export default Footer;