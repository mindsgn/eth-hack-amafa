// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AssetNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    struct AssetMetadata {
        string name;
        uint256 value;
        string currency;
        string category;
        string[] imageLinks;
    }

    mapping(uint256 => AssetMetadata) public assetMetadata;

    event AssetMinted(uint256 indexed tokenId, address indexed owner, string name, uint256 value);

    constructor() ERC721("AssetNFT", "ANFT") {}

    function mintAsset(
        address recipient,
        string memory name,
        uint256 value,
        string memory currency,
        string memory category,
        string[] memory imageLinks,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        _tokenIdCounter++;
       uint256 newTokenId = _tokenIdCounter;

        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        assetMetadata[newTokenId] = AssetMetadata({
            name: name,
            value: value,
            currency: currency,
            category: category,
            imageLinks: imageLinks
        });

        emit AssetMinted(newTokenId, recipient, name, value);

        return newTokenId;
    }

    function getAssetMetadata(uint256 tokenId) public view returns (AssetMetadata memory) {
        require(_exists(tokenId), "AssetNFT: Metadata query for nonexistent token");
        return assetMetadata[tokenId];
    }

    function updateAssetValue(uint256 tokenId, uint256 newValue) public onlyOwner {
        require(_exists(tokenId), "AssetNFT: Value update for nonexistent token");
        assetMetadata[tokenId].value = newValue;
    }

    function burn(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "AssetNFT: caller is not owner nor approved");
        _burn(tokenId);
        delete assetMetadata[tokenId];
    }
}