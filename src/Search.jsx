import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GoogleMap from "./GoogleMap";
import { useNavigate } from "react-router-dom";
import ReactSlider from "react-slider";
import "react-datepicker/dist/react-datepicker.css";
import {
    FaWifi,
    FaSnowflake,
    FaCoffee,
    FaParking,
    FaUtensils,
} from "react-icons/fa";
import { CgGym } from "react-icons/cg";
import axios from "./utils/axios";
import { useSelector } from "react-redux";

const Search = () => {
    const navigate = useNavigate();
    const [filterOpen, setFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState([1000, 50000]);
    const [sortOption, setSortOption] = useState(null);
    const [search, setSearch] = useState(useSelector(state => state.user.searchTerm));
    const [hotels, setHotels] = useState([]);

    const toggleFilter = () => {
        setFilterOpen(!filterOpen);
    };

    const [features, setFeatures] = useState({
        wifi: false,
        ac: false,
        breakfast: false,
        parking: false,
        kitchen: false,
        gym: false,
    });

    const handleFeatureChange = (e) => {
        setFeatures({ ...features, [e.target.name]: e.target.checked });
    };

    

    const filterHandler = async () => {

        const queryParams = Object.keys(features)
            .filter((key) => features[key]) 
            .map((key) => `${encodeURIComponent(key)}=true`) 
            .join("&");

        
        let searchParam = `&searchterm=${encodeURIComponent(search)}`
        
        if(sortOption !== null){
          const sort = sortOption[0] === "p" ? "sort=price" : "sort=rating";
          const order= sortOption[2] === "H" ? "order=desc" : "order=asc";
          searchParam += `&${sort}&${order}`;
        }
        searchParam += `&min_price=${priceRange[0]}&max_price=${priceRange[1]}`;

        
        const response = await axios.post(
            `/hotel/search?${queryParams}${searchParam}`
        );
        setHotels(response.data.data.hotels);
    };
    const ResetHandler = () => {
        setFeatures({
            wifi: false,
            ac: false,
            breakfast: false,
            parking: false,
            kitchen: false,
            gym: false,
        });
        setPriceRange([1000, 50000]);
        setSortOption(null);
        setSearch("");
    };
    useEffect(() => {
        filterHandler();
    }, []);
    return (
        <div>
            <Wrapper>
                <Content>
                    <SearchResults>
                        <SearchBar>
                            <input
                                type="text"
                                placeholder="Search Destination/Hotel"
                                value={search}
                                onChange={(e)=>setSearch(e.target.value)}
                            />
                            <button onClick={filterHandler}>Search</button>
                            <FilterButton onClick={toggleFilter}>
                                Filter
                            </FilterButton>
                        </SearchBar>
                        <ResultsGrid>
                            {hotels.map((hotel) => (
                                <ResultCard key={hotel._id}>
                                    <img
                                        src={hotel.images[0]}
                                        alt={hotel.title}
                                        className="result-card-image"
                                    />
                                    <div className="result-card-content">
                                        <h3>{hotel.title}</h3>
                                        <p>₹ {hotel.price}</p>
                                        <button
                                            className="result-card-button"
                                            // onClick={() =>
                                            //   alert(`Navigating to properties ${properties.id}`)
                                            // }
                                            onClick={() => navigate(`/hotel/${hotel._id}`)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </ResultCard>
                            ))}
                        </ResultsGrid>
                    </SearchResults>
                </Content>
                {filterOpen && (
                    <FilterBox>
                        <CloseButton onClick={toggleFilter}>×</CloseButton>
                        <h3>Filter Options</h3>
                        <FilterSection>
                            <label>Price Range:</label>
                            <ReactSlider
                                className="horizontal-slider"
                                thumbClassName="example-thumb"
                                trackClassName="example-track"
                                value={priceRange}
                                min={1000}
                                max={50000}
                                step={1000}
                                onChange={(value) => setPriceRange(value)}
                            />
                            <PriceRange>
                                <span>₹{priceRange[0]}</span>
                                <span>₹{priceRange[1]}</span>
                            </PriceRange>
                        </FilterSection>
                        <FilterSection>
                            <CheckboxContainer>
                                <CheckboxLabel checked={features.wifi}>
                                    <HiddenCheckbox
                                        name="wifi"
                                        checked={features.wifi}
                                        onChange={handleFeatureChange}
                                    />
                                    <FaWifi size={24} />
                                    WiFi
                                </CheckboxLabel>
                                <CheckboxLabel checked={features.ac}>
                                    <HiddenCheckbox
                                        name="ac"
                                        checked={features.ac}
                                        onChange={handleFeatureChange}
                                    />
                                    <FaSnowflake size={24} />
                                    AC
                                </CheckboxLabel>
                                <CheckboxLabel checked={features.breakfast}>
                                    <HiddenCheckbox
                                        name="breakfast"
                                        checked={features.breakfast}
                                        onChange={handleFeatureChange}
                                    />
                                    <FaCoffee size={24} />
                                    Breakfast
                                </CheckboxLabel>
                                <CheckboxLabel checked={features.parking}>
                                    <HiddenCheckbox
                                        name="parking"
                                        checked={features.parking}
                                        onChange={handleFeatureChange}
                                    />
                                    <FaParking size={24} />
                                    Parking
                                </CheckboxLabel>
                                <CheckboxLabel checked={features.kitchen}>
                                    <HiddenCheckbox
                                        name="kitchen"
                                        checked={features.kitchen}
                                        onChange={handleFeatureChange}
                                    />
                                    <FaUtensils size={24} />
                                    Kitchen
                                </CheckboxLabel>
                                <CheckboxLabel checked={features.gym}>
                                    <HiddenCheckbox
                                        name="gym"
                                        checked={features.laundry}
                                        onChange={handleFeatureChange}
                                    />
                                    <CgGym size={32} />
                                    Gym
                                </CheckboxLabel>
                            </CheckboxContainer>
                        </FilterSection>
                        <FilterSection>
                            <label>Sort By:</label>
                            <select
                                onChange={(e) => setSortOption(e.target.value)}
                                value={sortOption || ""}
                                style={{
                                    padding: "10px",
                                    fontSize: "16px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                    width: "100%",
                                    boxSizing: "border-box",
                                    "@media (max-width: 768px)": {
                                        fontSize: "14px",
                                        padding: "8px",
                                    },
                                }}
                            >
                                <option disabled value="">Select</option>
                                <option value="p:LowToHigh">
                                    Price: Low to High
                                </option>
                                <option value="p:HighToLow">
                                    Price: High to Low
                                </option>
                                <option value="r:HighToLow">
                                    Rating: High to Low
                                </option>
                                <option value="r:LowToHigh">
                                    Rating: Low to High
                                </option>
                            </select>
                            <div className="flex gap-5 mt-4">
                            <button
                                onClick={filterHandler}
                                className="bg-green-500 text-white p-2 rounded-md mt-2 mx-auto"
                            >
                                Apply Filter
                            </button>
                            <button
                                onClick={ResetHandler}
                                className="bg-white text-green-500 border-green-500 border-2 p-2 rounded-md mt-2 mx-auto"
                            >
                                Reset Filter
                            </button>
                            </div>
                        </FilterSection>
                    </FilterBox>
                )}
            </Wrapper>
        </div>
    );
};

export default Search;

const Wrapper = styled.div`
    background-color: #f0f8ff;
    color: #333;
    min-height: 100vh;
    padding: 20px;
    position: relative;
    overflow: hidden;
    font-family: "Josefin Sans", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

const SearchResults = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex: 7;
`;

const SearchBar = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    input {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        flex: 1;
        background-color: #fff;
        color: #333;
        outline: none;

        &:focus {
            outline: none;
        }
    }

    button {
        padding: 10px;
        border: none;
        border-radius: 5px;
        background-color: #4caf50;
        color: #fff;
        cursor: pointer;
        outline: none;

        &:focus {
            outline: none;
        }
    }
`;

const FilterButton = styled.button`
    padding: 10px;
    background-color: #4caf50;
    border: none;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
`;

const ResultsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
`;

const ResultCard = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-10px);
    }

    .result-card-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 10px 10px 0 0;
    }

    .result-card-content {
        padding: 10px;

        h3 {
            margin: 10px 0;
            color: #4caf50;
        }

        p {
            margin: 10px 0;
            color: #333;
            font-size: 16px;
            font-weight: bold;
        }
    }

    .result-card-button {
        padding: 10px 20px;
        background-color: #4caf50;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background-color: #45a049;
        }
    }
`;

const MapContainer = styled.div`
    flex: 3;
    background-color: #ddd;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    height: 100%;
    @media (min-width: 768px) {
        height: 90vh;
    }

    iframe {
        width: 100%;
        height: 100vh;
        border: 0;
    }
`;

const FilterBox = styled.div`
    position: fixed;
    top: 50%;
    right: 0;
    transform: translate(-5%, -65%);
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    width: 350px;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 1px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    color: #333;
    cursor: pointer;
`;

const FilterSection = styled.div`
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    justify-content: around;
`;

const CheckboxContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
`;

const CheckboxLabel = styled.label`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 80px;
    text-align: center;
    background-color: ${({ checked }) => (checked ? "#CAFFCB" : "#fff")};
    border-color: ${({ checked }) => (checked ? "#04AF70" : "#ddd")};
    box-shadow: ${({ checked }) =>
        checked
            ? "0 4px 8px rgba(0, 0, 0, 0.2)"
            : "0 2px 4px rgba(0, 0, 0, 0.1)"};

    &:hover {
        border-color: #04af70;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
    display: none;
`;

const PriceRange = styled.div`
    display: flex;
    justify-content: space-between;
    span {
        font-size: 14px;
        color: #333;
    }
`;

const sliderStyles = `
  .horizontal-slider {
    width: 100%;
    height: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  
  .example-thumb {
    height: 20px;
    width: 20px;
    background-color: #4caf50;
    border-radius: 50%;
    cursor: grab;
    border: 2px solid #fff;
  }
  
  .example-track {
    background: #ccc;
    height: 10px;
  }
`;

const styleTag = document.createElement("style");
styleTag.innerHTML = sliderStyles;
document.head.appendChild(styleTag);
