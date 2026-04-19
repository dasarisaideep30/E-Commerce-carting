import React, { useState, useEffect } from "react";
import { Plus, X, Upload, Save, AlertCircle, Loader2 } from "lucide-react";
import axios from '../axiosConfig';
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Nav from "../components/auth/nav";

const CreateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const userEmail = useSelector((state) => state.user.email);

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const categoriesData = [
    { title: "Electronics" },
    { title: "Fashion" },
    { title: "Books" },
    { title: "Home Appliances" },
  ];

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      axios
        .get(`/api/v2/product/product/${id}`)
        .then((response) => {
          const p = response.data.product;
          setName(p.name);
          setDescription(p.description);
          setCategory(p.category);
          setTags(p.tags ? p.tags.join(", ") : "");
          setPrice(p.price);
          setStock(p.stock);
          if (p.images && p.images.length > 0) {
            setPreviewImages(
              p.images.map((imgPath) => `http://localhost:8000${imgPath}`)
            );
          }
        })
        .catch((err) => {
          console.error("Error fetching product:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => prevImages.concat(files));
    const imagePreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevPreviews) => prevPreviews.concat(imagePreviews));
  };

  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) {
      alert("Please login first");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    tags.split(",").forEach((tag) => {
      formData.append("tags", tag.trim());
    });
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("email", userEmail);

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      if (isEdit) {
        await axios.put(`/api/v2/product/update-product/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product updated successfully!");
        navigate("/my-products");
      } else {
        await axios.post("/api/v2/product/create-product", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product created successfully!");
        navigate("/my-products");
      }
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 pb-20">
      <Nav />
      <div className="max-w-4xl mx-auto px-4 mt-12">
        <div className="bg-neutral-800/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <h5 className="text-3xl font-bold flex items-center space-x-3">
              {isEdit ? <Save size={32} /> : <Plus size={32} />}
              <span>{isEdit ? "Edit Product" : "Launch New Product"}</span>
            </h5>
            <p className="opacity-80 mt-2">Fill in the details to showcase your product to the world.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Basic Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Product Name <span className="text-indigo-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="e.g. Premium Wireless Headphones"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Category <span className="text-indigo-500">*</span></label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                  >
                    <option value="">Choose Category</option>
                    {categoriesData.map((cat) => (
                      <option key={cat.title} value={cat.title}>{cat.title}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Price ($) <span className="text-indigo-500">*</span></label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Stock <span className="text-indigo-500">*</span></label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Description & Tags */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Description <span className="text-indigo-500">*</span></label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                    placeholder="Describe your product in detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="e.g. wireless, audio, premium"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload Area */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-neutral-400">Product Images</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {previewImages.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-2xl border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-white/5 transition-all cursor-pointer flex flex-col items-center justify-center text-neutral-500 hover:text-indigo-400">
                  <Upload size={32} strokeWidth={1.5} />
                  <span className="text-xs mt-2 font-medium">Add Photo</span>
                  <input type="file" multiple className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-neutral-500 text-sm">
                <AlertCircle size={16} />
                <span>Publishing as {userEmail || "Guest"}</span>
              </div>
              <button
                type="submit"
                disabled={loading || !userEmail}
                className="px-12 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-2 shadow-xl shadow-indigo-600/20"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <span>{isEdit ? "Update Product" : "Create Product"}</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;