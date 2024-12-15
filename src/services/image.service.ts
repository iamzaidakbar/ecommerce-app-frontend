interface PicsumImage {
  id: string;
  author: string;
  url: string;
  download_url: string;
}

export const imageService = {
  // Get a random fashion image
  async getRandomFashionImage(): Promise<string> {
    try {
      const randomId = Math.floor(Math.random() * 1000);
      return `https://picsum.photos/id/${randomId}/800/1200`;
    } catch (error) {
      console.error('Error fetching random image:', error);
      return '/fallback-image.jpg';
    }
  },

  // Get multiple random fashion images
  async getRandomFashionImages(count: number = 10): Promise<string[]> {
    try {
      const response = await fetch(`https://picsum.photos/v2/list?page=1&limit=${count}`);
      const data: PicsumImage[] = await response.json();
      return data.map(image => `https://picsum.photos/id/${image.id}/800/1200`);
    } catch (error) {
      console.error('Error fetching random images:', error);
      return Array(count).fill('/fallback-image.jpg');
    }
  },

  // Get category specific image (simulated with seed)
  async getCategoryImage(category: string): Promise<string> {
    try {
      // Using category name as seed for consistent images per category
      return `https://picsum.photos/seed/${category}/800/1200`;
    } catch (error) {
      console.error(`Error fetching ${category} image:`, error);
      return '/fallback-image.jpg';
    }
  },

  // Get category specific images
  async getCategoryImages(category: string, count: number = 10): Promise<string[]> {
    try {
      return Array(count).fill(null).map((_, index) => 
        `https://picsum.photos/seed/${category}${index}/800/1200`
      );
    } catch (error) {
      console.error(`Error fetching ${category} images:`, error);
      return Array(count).fill('/fallback-image.jpg');
    }
  }
}; 