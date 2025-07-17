const testimonials = [
    {
        name: "T. Bence",
        text: "Nagyszerű szolgáltatás! Gyors kiszállítás és minőségi termékek. Biztosan újra rendelek!",
    },
    {
        name: "S. Éva",
        text: "Lenyűgözött a választék és a könnyű rendelési folyamat. Csak ajánlani tudom!",
    },
    {
        name: "V. Anna",
        text: "A termékek pontosan olyanok, mint a képeken. Profi ügyfélszolgálat és gyors szállítás.",
    },
];

const Testimonials = () => {
    return (
        <div className="container mx-auto px-12 my-16">
            <h2 className="text-4xl font-bold text-center mb-6 text-primary">Vásárlóink véleménye</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white p-6 border rounded-lg shadow-lg text-center h-52 flex flex-col">
                        <h3 className="text-xl font-semibold text-primary">{testimonial.name}</h3>
                        <hr className="my-3 border-gray-300" />
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-gray-600">{testimonial.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;