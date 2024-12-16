"use client";

import {  useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { mockService } from "@/services/mock.service";
import { VideoBackground } from '@/components/VideoBackground';
import { imageService } from "@/services/image.service";

interface Collection {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
}

const collections: Collection[] = [
  {
    id: "1",
    title: "MAN",
    description: "Spring/Summer 2024",
    link: "/man",
    image: await imageService.getCategoryImage('man')
  },
  {
    id: "2",
    title: "WOMAN",
    description: "Spring/Summer 2024",
    link: "/woman",
    image: await imageService.getCategoryImage('woman')
  },
  {
    id: "3",
    title: "KIDS",
    description: "Spring/Summer 2024",
    link: "/kids",
    image: await imageService.getCategoryImage('kids')
  }
];

export default function HomePage() {
  const [activeCollection, setActiveCollection] = useState<string | null>(null);

  const { data: newArrivals } = useQuery({
    queryKey: ['products', 'new'],
    queryFn: mockService.getProducts,
    select: (products) => products.slice(0, 4),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="min-h-screen relative">
      <VideoBackground />

      {/* Main content */}
      <main className="relative z-10">
        {/* Hero section */}
        <section className="h-screen flex items-center justify-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h1 className="text-6xl font-light tracking-widest">NEW SEASON</h1>
            <p className="text-xl font-light tracking-wider">Spring/Summer 2024</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/view-all"
                className="inline-flex items-center space-x-2 text-sm tracking-wider hover:opacity-80 transition-opacity"
              >
                <span>VIEW ALL</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Collections */}
        <section className="py-20 px-8 bg-white">
          <div className="max-w-8xl mx-auto">
            <h2 className="text-3xl font-light tracking-wider mb-12 text-black">COLLECTIONS</h2>
            <div className="grid grid-cols-3 gap-8">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={collection.link}
                  className="group relative"
                  onMouseEnter={() => setActiveCollection(collection.id)}
                  onMouseLeave={() => setActiveCollection(null)}
                >
                  <motion.div
                    className="relative aspect-[3/4] overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.img
                      src={collection.image}
                      alt={collection.title}
                      className="object-cover w-full h-full"
                      animate={{
                        scale: activeCollection === collection.id ? 1.1 : 1
                      }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h3 className="text-2xl font-light tracking-wider mb-2">
                        {collection.title}
                      </h3>
                      <p className="text-sm tracking-wider opacity-80">
                        {collection.description}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-20 px-8">
          <div className="max-w-8xl mx-auto">
            <h2 className="text-3xl font-light tracking-wider mb-12 text-black">NEW ARRIVALS</h2>
            <div className="grid grid-cols-4 gap-8">
              {newArrivals?.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product._id}`}
                  className="group"
                >
                  <motion.div
                    className="relative aspect-[3/4] overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.img
                      src={product.imageUrl}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </motion.div>
                  <div className="mt-4 space-y-1">
                    <h3 className="text-sm font-light">{product.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
