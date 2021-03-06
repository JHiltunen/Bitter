[![GitHub liecnse](https://img.shields.io/badge/license-GNU-blue.svg)](https://choosealicense.com/licenses/gpl-3.0/) 
[![GitHub contributors](https://img.shields.io/github/contributors/jhiltunen/bitter?color=blue)](https://github.com/JHiltunen/Bitter/graphs/contributors)

Bitter is a tech forum web aplication where you can ask and offer help with coding issues for those how are interested in coding

# Bitter

<p align="center">
<img src = "https://user-images.githubusercontent.com/71440030/116994222-1bdcb400-ace1-11eb-9005-1925187f58a2.JPG"  alt="Screenshot of the page" width="500" height="437"/>

## About the Project

A school project designed to develop a media sharing application

## Built with

<ul>
  <li> HTML </li> 
  <li> CSS </li>
  <li> JS </li>
  <li> Node.JS </li>
  <li> REST API </li>
  <li> MySQL </li>
</ul>

## Examples

```jsx
const getUserId = async () => {
  try {
    const fetchOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    console.log("Fetchoptions: ", fetchOptions);

    const response = await fetch(url + "/user/", fetchOptions);

    console.log(response);
    const json = await response.json();
    console.log("UserId: ", json);
    user = json;
  } catch (e) {
    console.log("Error getting userid", e.message);
  }
};
```

## License
 
Project is [GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/) licensed.

