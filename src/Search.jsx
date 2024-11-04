import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GoogleMap from "./GoogleMap";
import { useNavigate } from "react-router-dom";
import ReactSlider from "react-slider";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
import useHandleErr from "./utils/useHandleErr";
import Preloader from "./Preloader";

const Search = () => {
    const navigate = useNavigate();
    const [filterOpen, setFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 50000]);
    const [sortOption, setSortOption] = useState(null);
    const [search, setSearch] = useState(
        useSelector((state) => state.user.searchTerm)
    );
    const [hotels, setHotels] = useState([]);
    const handleError = useHandleErr();
    const toggleFilter = () => {
        setFilterOpen(!filterOpen);
    };
    const [loading, setLoading] = useState(true);
    const [features, setFeatures] = useState({
        wifi: false,
        ac: false,
        breakfast: false,
        parking: false,
        kitchen: false,
        gym: false,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16;

    const indexOfLastHotel = currentPage * itemsPerPage;
    const indexOfFirstHotel = indexOfLastHotel - itemsPerPage;
    const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);
    const totalPages = Math.ceil(hotels.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        document.querySelector(".results-grid")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const handleFeatureChange = (e) => {
        setFeatures({ ...features, [e.target.name]: e.target.checked });
    };

    const filterHandler = async () => {
        setFilterOpen(false);
        setLoading(true);
        const queryParams = Object.keys(features)
            ?.filter((key) => features[key])
            ?.map((key) => `${encodeURIComponent(key)}=true`)
            ?.join("&");

        let searchParam = `&searchterm=${encodeURIComponent(search)}`;

        if (sortOption !== null) {
            const sort = sortOption[0] === "p" ? "sort=price" : "sort=rating";
            const order = sortOption[2] === "H" ? "order=desc" : "order=asc";
            searchParam += `&${sort}&${order}`;
        }
        searchParam += `&min_price=${priceRange[0]}&max_price=${priceRange[1]}`;

        try {
            const response = await axios.post(
                `/hotel/search?${queryParams}${searchParam}`
            );
            setHotels(response.data.data.hotels);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
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
        setPriceRange([0, 50000]);
        setSortOption(null);
        setSearch("");
    };
    useEffect(() => {
        filterHandler();
    }, []);
    return loading ? (
        <Preloader />
    ) : (
        <div className="">
            <Wrapper>
                <Content>
                    <SearchResults>
                        <SearchBar style={{ marginTop: "9vh", position: "relative" }}>
                            <input
                                type="text"
                                placeholder="Search Destination/Hotel"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button className="search" onClick={filterHandler}>Search</button>
                            <FilterButton onClick={toggleFilter}>
                                Filter
                            </FilterButton>
                            {filterOpen && (
                                <FilterBox>
                                    <CloseButton onClick={toggleFilter}>
                                        ×
                                    </CloseButton>
                                    <h3>Filter Options</h3>
                                    <FilterSection>
                                        <label>Price Range:</label>
                                        <ReactSlider
                                            className="horizontal-slider"
                                            thumbClassName="example-thumb"
                                            trackClassName="example-track"
                                            value={priceRange}
                                            min={0}
                                            max={50000}
                                            step={1000}
                                            onChange={(value) =>
                                                setPriceRange(value)
                                            }
                                        />
                                        <PriceRange>
                                            <span>₹{priceRange[0]}</span>
                                            <span>₹{priceRange[1]}</span>
                                        </PriceRange>
                                    </FilterSection>
                                    <FilterSection>
                                        <CheckboxContainer>
                                            <CheckboxLabel
                                                checked={features.wifi}
                                            >
                                                <HiddenCheckbox
                                                    name="wifi"
                                                    checked={features.wifi}
                                                    onChange={
                                                        handleFeatureChange
                                                    }
                                                />
                                                <FaWifi size={24} />
                                                WiFi
                                            </CheckboxLabel>
                                            <CheckboxLabel
                                                checked={features.ac}
                                            >
                                                <HiddenCheckbox
                                                    name="ac"
                                                    checked={features.ac}
                                                    onChange={
                                                        handleFeatureChange
                                                    }
                                                />
                                                <FaSnowflake size={24} />
                                                AC
                                            </CheckboxLabel>
                                            <CheckboxLabel
                                                checked={features.breakfast}
                                            >
                                                <HiddenCheckbox
                                                    name="breakfast"
                                                    checked={features.breakfast}
                                                    onChange={
                                                        handleFeatureChange
                                                    }
                                                />
                                                <FaCoffee size={24} />
                                                Breakfast
                                            </CheckboxLabel>
                                            <CheckboxLabel
                                                checked={features.parking}
                                            >
                                                <HiddenCheckbox
                                                    name="parking"
                                                    checked={features.parking}
                                                    onChange={
                                                        handleFeatureChange
                                                    }
                                                />
                                                <FaParking size={24} />
                                                Parking
                                            </CheckboxLabel>
                                            <CheckboxLabel
                                                checked={features.kitchen}
                                            >
                                                <HiddenCheckbox
                                                    name="kitchen"
                                                    checked={features.kitchen}
                                                    onChange={
                                                        handleFeatureChange
                                                    }
                                                />
                                                <FaUtensils size={24} />
                                                Kitchen
                                            </CheckboxLabel>
                                            <CheckboxLabel
                                                checked={features.gym}
                                            >
                                                <HiddenCheckbox
                                                    name="gym"
                                                    checked={features.laundry}
                                                    onChange={
                                                        handleFeatureChange
                                                    }
                                                />
                                                <CgGym size={32} />
                                                Gym
                                            </CheckboxLabel>
                                        </CheckboxContainer>
                                    </FilterSection>
                                    <FilterSection>
                                        <label>Sort By:</label>
                                        <select
                                            onChange={(e) =>
                                                setSortOption(e.target.value)
                                            }
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
                                            <option disabled value="">
                                                Select
                                            </option>
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
                        </SearchBar>
                        <ResultsGrid className="results-grid">
                            {currentHotels?.map((hotel) => (
                                <ResultCard
                                    key={hotel._id}
                                    className="animate-fadeIn"
                                >
                                    <img
                                        src={hotel.images[0]}
                                        alt={hotel.title}
                                        className="result-card-image"
                                    />
                                    <div className="result-card-content">
                                        <h3>{hotel.title}</h3>
                                        <p>
                                            ₹{" "}
                                            {typeof hotel.price === "number"
                                                ? hotel.price.toLocaleString(
                                                      "en-IN"
                                                  )
                                                : "N/A"}
                                        </p>
                                        <button
                                            className="result-card-button"
                                            onClick={() =>
                                                navigate(`/hotel/${hotel._id}`)
                                            }
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </ResultCard>
                            ))}
                        </ResultsGrid>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <PaginationContainer>
                                <NavigationButton
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft size={20} />
                                </NavigationButton>

                                <PaginationNumbers>
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1
                                    )?.map((pageNum) => (
                                        <PageButton
                                            key={pageNum}
                                            onClick={() =>
                                                handlePageChange(pageNum)
                                            }
                                            active={pageNum === currentPage}
                                        >
                                            {pageNum}
                                        </PageButton>
                                    ))}
                                </PaginationNumbers>

                                <NavigationButton
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight size={20} />
                                </NavigationButton>
                            </PaginationContainer>
                        )}
                    </SearchResults>
                </Content>
            </Wrapper>
        </div>
    );
};

export default Search;

const Wrapper = styled.div`
    background-color: #f0f5ff;
    color: #2d3436;
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
    gap: 24px;
    max-width: 1440px;
    margin: 0 auto;
    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

const SearchResults = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    flex: 7;
`;

const SearchBar = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    background: white;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

    input {
        padding: 12px 16px;
        border: 2px solid #eee;
        border-radius: 8px;
        flex: 1;
        background-color: #fff;
        color: #2d3436;
        font-size: 1rem;
        transition: all 0.3s ease;

        &:focus {
            border-color: #059669;
            box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }
    }

    .search {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        background-color: #4caf50;
        color: #fff;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;

        &:hover {
            background-color: #047857;
            transform: translateY(-1px);
        }
    }
`;

const FilterButton = styled.button`
    padding: 12px 24px;
    background: linear-gradient(135deg, #8b4513, #cd853f) !important;
    border: none;
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(205, 133, 63, 0.2);
    }
`;

const ResultsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`;

const ResultCard = styled.div`
    background-color: #fff;
    border-radius: 16px;
    padding: 0;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    text-align: center;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    }

    .result-card-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    &:hover .result-card-image {
        transform: scale(1.05);
    }

    .result-card-content {
        padding: 20px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        h3 {
            margin: 8px 0 12px;
            color: #059669;
            font-size: 1.25rem;
            font-weight: 600;
        }

        p {
            margin: 8px 0;
            color: #2d3436;
            font-size: 1.1rem;
            font-weight: 500;
        }
    }

    .result-card-button {
        padding: 10px 20px;
        background: #f3e5d0;
        color: #6e260e;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        margin: 16px;
        font-weight: 500;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(5, 150, 105, 0.2);
        }
    }
`;

const FilterBox = styled.div`
    position: absolute;
    z-index: 10;
    top:  ${(props) => (window.innerWidth <= 768 ? window.innerWidth <= 500 ? "420px": "320px" : "530px")};
    right: 0;
    transform: ${(props) =>
        window.innerWidth <= 768 ? "translateY(-50%)" : "translate(-5%, -65%)"};
    background-color: #fff;
    padding: ${(props) => (window.innerWidth <= 768 ? "24px 16px" : "32px")};
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    width: ${(props) => (window.innerWidth <= 768 ? "90%" : "350px")};
    margin: ${(props) => (window.innerWidth <= 768 ? "0 auto" : "0")};
    border: 1px solid rgba(5, 150, 105, 0.1);
    overflow-y: auto;


    @media (max-width: 480px) {
        width: 95%;
        padding: 20px 12px;
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: ${(props) => (window.innerWidth <= 768 ? "12px" : "16px")};
    right: ${(props) => (window.innerWidth <= 768 ? "12px" : "16px")};
    background: none;
    border: none;
    font-size: ${(props) => (window.innerWidth <= 768 ? "20px" : "24px")};
    color: #059669;
    cursor: pointer;
    transition: transform 0.3s ease;
    z-index: 1;

    &:hover {
        transform: rotate(90deg);
    }
`;

const FilterSection = styled.div`
    margin-bottom: ${(props) => (window.innerWidth <= 768 ? "20px" : "24px")};
    display: flex;
    flex-direction: column;
    gap: ${(props) => (window.innerWidth <= 768 ? "8px" : "12px")};
`;

const CheckboxContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${(props) => (window.innerWidth <= 768 ? "8px" : "12px")};
    justify-content: center;

    @media (max-width: 480px) {
        gap: 6px;
    }
`;

const CheckboxLabel = styled.label`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${(props) => (window.innerWidth <= 768 ? "6px" : "8px")};
    border: 2px solid ${({ checked }) => (checked ? "#059669" : "#eee")};
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    width: ${(props) => (window.innerWidth <= 768 ? "80px" : "90px")};
    text-align: center;
    background-color: ${({ checked }) => (checked ? "#ECFDF5" : "#fff")};
    box-shadow: ${({ checked }) =>
        checked
            ? "0 4px 12px rgba(5, 150, 105, 0.15)"
            : "0 2px 8px rgba(0, 0, 0, 0.05)"};

    &:hover {
        border-color: #10b981;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(5, 150, 105, 0.1);
    }

    @media (max-width: 480px) {
        width: 70px;
        font-size: 0.9rem;
        padding: 4px;
    }
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
    display: none;
`;

const PriceRange = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${(props) => (window.innerWidth <= 768 ? "6px" : "8px")};

    span {
        font-size: ${(props) =>
            window.innerWidth <= 768 ? "0.9rem" : "0.95rem"};
        color: #2d3436;
        font-weight: 500;
    }

    @media (max-width: 480px) {
        span {
            font-size: 0.85rem;
        }
    }
`;

const sliderStyles = `
  .horizontal-slider {
    width: 100%;
    height: 8px;
    margin: ${window.innerWidth <= 768 ? "12px 0" : "16px 0"};
  }
  
  .example-thumb {
    margin-top: -6px;
    height: ${window.innerWidth <= 768 ? "18px" : "20px"};
    width: ${window.innerWidth <= 768 ? "18px" : "20px"};
    background: linear-gradient(135deg, #10B981, #059669);
    border-radius: 50%;
    cursor: grab;
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(5, 150, 105, 0.2);
    transition: transform 0.2s ease;
  }
  
  .example-thumb:hover {
    transform: scale(1.1);
  }
  
  .example-track {
    background: #eee;
    height: ${window.innerWidth <= 768 ? "6px" : "8px"};
    border-radius: 4px;
  }
  
  .example-track.example-track-1 {
    background: linear-gradient(to right, #10B981, #059669);
  }

  @media (max-width: 480px) {
    .example-thumb {
      height: 16px;
      width: 16px;
    }
    .example-track {
      height: 4px;
    }
  }
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 40px 0;
    gap: 20px;
`;

const PaginationNumbers = styled.div`
    display: flex;
    gap: 10px;
`;

const PageButton = styled.button`
    width: 40px;
    height: 40px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: white;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
        background-color: #1c8e20;
        color: white;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    ${(props) =>
        props.active &&
        `
        background-color: #4caf50;
        color: white;
        border-color: #4caf50;
    `}
`;

const NavigationButton = styled(PageButton)`
    &:hover:not(:disabled) {
        background-color: #1c8e20;
    }
`;

const styleTag = document.createElement("style");
styleTag.innerHTML = sliderStyles;
document.head.appendChild(styleTag);
