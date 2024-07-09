import React, { useState } from "react";
import styled from "styled-components";
import GoogleMap from "./GoogleMap";
import { useNavigate } from "react-router-dom";
import ReactSlider from "react-slider";
import "react-datepicker/dist/react-datepicker.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FaWifi,
  FaSnowflake,
  FaCoffee,
  FaParking,
  FaTv,
  FaUtensils,
  FaTshirt,
} from "react-icons/fa";

const Search = () => {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([500, 4000]);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const [features, setFeatures] = useState({
    wifi: true,
    ac: true,
    breakfast: false,
    parking: true,
    tv: false,
    kitchen: true,
    laundry: true,
  });

  const handleFeatureChange = (e) => {
    setFeatures({ ...features, [e.target.name]: e.target.checked });
  };

  const properties = [
    {
      id: 1,
      title: "Cozy Apartment",
      price: "₹1200/night",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 2,
      title: "Luxury Villa",
      price: "₹3500/night",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 3,
      title: "Modern House",
      price: "₹2000/night",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 4,
      title: "Beachfront Condo",
      price: "₹2200/night",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 5,
      title: "Mountain Cabin",
      price: "₹1800/night",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 6,
      title: "Urban Loft",
      price: "₹1500/night",
      image: "https://via.placeholder.com/300",
    },
  ];

  return (
    <div>
      <Wrapper>
        <Content>
          <SearchResults>
            <SearchBar>
              <input type="text" placeholder="Search Destination" />
              <button>Search</button>
              <FilterButton onClick={toggleFilter}>Filter</FilterButton>
            </SearchBar>
            <ResultsGrid>
              {properties.map((property) => (
                <ResultCard key={property.id}>
                  <img
                    src={property.image}
                    alt={property.title}
                    className="result-card-image"
                  />
                  <div className="result-card-content">
                    <h3>{property.title}</h3>
                    <p>{property.price}</p>
                    <button
                      className="result-card-button"
                      // onClick={() =>
                      //   alert(`Navigating to property ${property.id}`)
                      // }
                      onClick={() => navigate("/single")}
                    >
                      View Details
                    </button>
                  </div>
                </ResultCard>
              ))}
            </ResultsGrid>
          </SearchResults>
          <MapContainer>
            <GoogleMap />
          </MapContainer>
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
                defaultValue={priceRange}
                min={500}
                max={10000}
                step={10}
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
                <CheckboxLabel checked={features.tv}>
                  <HiddenCheckbox
                    name="tv"
                    checked={features.tv}
                    onChange={handleFeatureChange}
                  />
                  <FaTv size={24} />
                  TV
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
                <CheckboxLabel checked={features.laundry}>
                  <HiddenCheckbox
                    name="laundry"
                    checked={features.laundry}
                    onChange={handleFeatureChange}
                  />
                  <FaTshirt size={24} />
                  Laundry
                </CheckboxLabel>
              </CheckboxContainer>
            </FilterSection>
            <FilterSection>
              <label>Sort By:</label>
              <select
                onChange={(e) => setSortOption(e.target.value)}
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
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="ratingHighToLow">Rating: High to Low</option>
                <option value="ratingLowToHigh">Rating: Low to High</option>
              </select>
            </FilterSection>
          </FilterBox>
        )}
      </Wrapper>
    </div>
  );
};

export default Search;

const Wrapper = styled.div`
  margin-top: 85px;
  background-color: #f0f8ff;
  color: #333;
  min-height: 100vh;
  padding: 20px;
  position: relative;
  overflow: hidden;
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
  }
  button {
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #4caf50;
    color: #fff;
    cursor: pointer;
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
  left: 50%;
  transform: translate(-50%, -50%);
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
    checked ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "0 2px 4px rgba(0, 0, 0, 0.1)"};

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
