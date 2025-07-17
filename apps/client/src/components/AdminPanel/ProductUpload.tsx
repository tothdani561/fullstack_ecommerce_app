import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateProduct, useUploadProductImages } from "../../utils/useProduct/useProducts";
import { useDropzone } from "react-dropzone";

const categories = [
    "UNIQUE_FLOWER_ARRANGEMENTS",
    "DRY_PLANT_MOSS_ART",
    "UNIQUE_WIRE_JEWELRY",
];

const ProductUploadComponent = () => {
    const { register, handleSubmit, reset } = useForm();
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const createProductMutation = useCreateProduct();
    const uploadImagesMutation = useUploadProductImages();

    const onDrop = (acceptedFiles: File[]) => {
        setImages((prev) => [...prev, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: true,
    });

    useEffect(() => {
        if (images.length === 0) {
            setPreviewUrls([]);
            return;
        }

        const newUrls = images.map((image) => URL.createObjectURL(image));
        setPreviewUrls(newUrls);

        return () => {
            newUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [images]);

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: any) => {
        setUploading(true);
        try {
            console.log("📤 Küldés indul:", data);

            const product = await createProductMutation.mutateAsync(data);
            console.log("✅ Termék létrehozva:", product);

            if (images.length > 0) {
                await uploadImagesMutation.mutateAsync({ productId: product.id, images });
                console.log("📸 Képek feltöltve!");
            }

            alert("✅ Termék sikeresen létrehozva!");
            reset();
            setImages([]);
        } catch (error: any) {
            console.error("❌ Hiba történt:", error);
            alert("❌ Hiba történt a feltöltés során.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white border shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">🛒 Termékfeltöltés</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input {...register("name", { required: true })} placeholder="Termék neve" className="w-full p-2 border rounded" />
                <textarea {...register("description", { required: true })} placeholder="Leírás" className="w-full p-2 border rounded" />
                <input {...register("price", { required: true })} type="number" placeholder="Ár (Ft)" className="w-full p-2 border rounded" />
                <input {...register("discountPrice")} type="number" placeholder="Akciós ár (Ft)" className="w-full p-2 border rounded" />
                
                <label className="flex items-center space-x-2">
                    <input {...register("stock")} type="checkbox" />
                    <span>Raktáron van</span>
                </label>
                
                <select {...register("category", { required: true })} className="w-full p-2 border rounded">
                    <option value="">Válassz kategóriát</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4">Fényképek feltöltése</h2>
                    <div
                        {...getRootProps()}
                        className="border-2 border-dashed p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200"
                    >
                        <input {...getInputProps()} />
                        <p className="text-gray-700">Húzd ide a képeket vagy kattints a feltöltéshez</p>
                    </div>
                    {previewUrls.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-5 sm:grid-cols-4 gap-2 mt-6">
                            {previewUrls.map((src, index) => (
                                <div key={index} className="relative group w-40 h-40">
                                    <img
                                        src={src}
                                        alt={`Uploaded Image ${index + 1}`}
                                        className="rounded-lg object-cover w-full h-full"
                                    />
                                    <button
                                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                                        onClick={() => removeImage(index)}
                                    >
                                        <span className="text-red-600 text-7xl font-bold">✖️</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button type="submit" disabled={uploading} className="w-full bg-primary text-white py-2 rounded">
                    {uploading ? "📤 Feltöltés..." : "🚀 Termék létrehozása"}
                </button>
            </form>
        </div>
    );
};

export default ProductUploadComponent;