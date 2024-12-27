import axios from "axios";

 export const getJokes = async () => {
    try {
        const response = await axios.get('https://api.chucknorris.io/jokes/categories');
        return response.data
    } catch (error) {
        console.error(error);
        return []
    }
}

export const getAJoke = async (category) => {
    try {
        const response = await axios.get(`https://api.chucknorris.io/jokes/random?category=${category}`);
        return {value: response.data.value, id: response.data.id}
        
    } catch (error) {
        console.error(error);
        return []
    }
}

export const searchJokes = async (word) => {
    try {
        const response = await axios.get(`https://api.chucknorris.io/jokes/search?query=${word}`);
        return response.data
        
    } catch (error) {
        console.error(error);
        return {
            result: [],
            total: 0
          }
    }
}
