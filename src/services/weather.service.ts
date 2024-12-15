export type WeatherType = 'Summer' | 'Monsoon' | 'Post-Monsoon' | 'Winter' | 'Spring';

export interface WeatherInfo {
  type: WeatherType;
  description: string;
  temperature: {
    min: number;
    max: number;
  };
  characteristics: string[];
}

export const weatherService = {
  getCurrentWeather(): WeatherInfo {
    const currentMonth = new Date().getMonth() + 1; // 1-12

    // Indian Weather Seasons
    switch (currentMonth) {
      // Summer (March to May)
      case 3:
      case 4:
      case 5:
        return {
          type: 'Summer',
          description: 'Hot and Dry Season',
          temperature: {
            min: 25,
            max: 45
          },
          characteristics: [
            'Intense heat',
            'Clear skies',
            'Low humidity',
            'Hot winds (loo)',
            'Occasional dust storms'
          ]
        };

      // Monsoon (June to September)
      case 6:
      case 7:
      case 8:
      case 9:
        return {
          type: 'Monsoon',
          description: 'Rainy Season',
          temperature: {
            min: 20,
            max: 35
          },
          characteristics: [
            'Heavy rainfall',
            'High humidity',
            'Cloudy skies',
            'Thunderstorms',
            'Green landscapes'
          ]
        };

      // Post-Monsoon (October to November)
      case 10:
      case 11:
        return {
          type: 'Post-Monsoon',
          description: 'Retreating Monsoon Season',
          temperature: {
            min: 15,
            max: 30
          },
          characteristics: [
            'Moderate temperatures',
            'Clear skies',
            'Occasional rainfall',
            'Comfortable humidity',
            'Festival weather'
          ]
        };

      // Winter (December to February)
      case 12:
      case 1:
      case 2:
        return {
          type: 'Winter',
          description: 'Cold Season',
          temperature: {
            min: 5,
            max: 25
          },
          characteristics: [
            'Cold mornings and nights',
            'Fog in northern regions',
            'Pleasant afternoons',
            'Occasional cold waves',
            'Clear skies'
          ]
        };

      default:
        return {
          type: 'Spring',
          description: 'Transition Season',
          temperature: {
            min: 20,
            max: 35
          },
          characteristics: [
            'Moderate temperatures',
            'Pleasant weather',
            'Occasional showers',
            'Blooming flowers',
            'Comfortable humidity'
          ]
        };
    }
  },

  // Helper method to get season by specific month
  getWeatherByMonth(month: number): WeatherInfo {
    if (month < 1 || month > 12) {
      throw new Error('Invalid month. Please provide a number between 1 and 12');
    }
    
    const currentDate = new Date();
    currentDate.setMonth(month - 1);
    return this.getCurrentWeather();
  }
}; 