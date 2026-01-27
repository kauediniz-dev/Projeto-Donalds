import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ProductsPage = () => {
    return (
        <div className="p-5 border border-red-500 rounded-xl">
            <h1 className="text-red-500 p-5">products page</h1>
            <button>FSW 7.0</button>
            <Input placeholder="Bora fazer o projeto" />
        </div>
    );
}

export default ProductsPage;