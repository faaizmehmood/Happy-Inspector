import SelectIcon1 from '../../assets/images/questionIconsWhite/SelectIcon1.svg';
import SelectIcon2 from '../../assets/images/questionIconsWhite/residential_White_Icon.svg';
import SelectIcon3 from '../../assets/images/questionIconsWhite/SelectIcon3.svg';
import SelectIcon4 from '../../assets/images/questionIconsWhite/SelectIcon4.svg';
import SelectIcon5 from '../../assets/images/questionIconsWhite/commercial__White_Icon.svg';
import SelectIcon6 from '../../assets/images/questionIconsWhite/SelectIcon6.svg';
import SelectIcon7 from '../../assets/images/questionIconsWhite/SelectIcon7.svg';
import SelectIcon8 from '../../assets/images/questionIconsWhite/SelectIcon8.svg';
import SelectIcon9 from '../../assets/images/questionIconsWhite/SelectIcon9.svg';
import SelectIcon10 from '../../assets/images/questionIconsWhite/SelectIcon10.svg';
import SelectIcon11 from '../../assets/images/questionIconsWhite/SelectIcon11.svg';
import SelectIcon12 from '../../assets/images/questionIconsWhite/SelectIcon12.svg';
import SelectIcon13 from '../../assets/images/questionIconsWhite/SelectIcon13.svg';
import SelectIcon14 from '../../assets/images/questionIconsWhite/SelectIcon14.svg';
import SelectIcon15 from '../../assets/images/questionIconsWhite/SelectIcon15.svg';
import SelectIcon16 from '../../assets/images/questionIconsWhite/SelectIcon16.svg';
import SelectIcon17 from '../../assets/images/questionIconsWhite/SelectIcon17.svg';
import SelectIcon18 from '../../assets/images/questionIconsWhite/SelectIcon18.svg';
import SelectIcon19 from '../../assets/images/questionIconsWhite/SelectIcon19.svg';
import SelectIcon20 from '../../assets/images/questionIconsWhite/SelectIcon20.svg';
import SelectIcon21 from '../../assets/images/questionIconsWhite/SelectIcon2.svg';
import SelectIcon22 from '../../assets/images/questionIconsWhite/SelectIcon5.svg';


export const IconsArr = [
    { id: '1', icon: <SelectIcon1 /> },
    { id: '2', icon: <SelectIcon2 /> },
    { id: '3', icon: <SelectIcon3 /> },
    { id: '4', icon: <SelectIcon4 /> },
    { id: '5', icon: <SelectIcon5 /> },
    { id: '6', icon: <SelectIcon6 /> },
    { id: '7', icon: <SelectIcon7 /> },
    { id: '8', icon: <SelectIcon8 /> },
    { id: '9', icon: <SelectIcon9 /> },
    { id: '10', icon: <SelectIcon10 /> },
    { id: '11', icon: <SelectIcon11 /> },
    { id: '12', icon: <SelectIcon12 /> },
    { id: '13', icon: <SelectIcon13 /> },
    { id: '14', icon: <SelectIcon14 /> },
    { id: '15', icon: <SelectIcon15 /> },
    { id: '16', icon: <SelectIcon16 /> },
    { id: '17', icon: <SelectIcon17 /> },
    { id: '18', icon: <SelectIcon18 /> },
    { id: '19', icon: <SelectIcon19 /> },
    { id: '20', icon: <SelectIcon20 /> },
    { id: '21', icon: <SelectIcon21 /> },
    { id: '22', icon: <SelectIcon22 /> },
];

// Function to get icon by id
export const getWhiteIconById = (id) => {
    const iconObj = IconsArr.find(item => item.id === id);
    return iconObj ? iconObj.icon : null;  // Return the icon or null if not found
};

// !Note the iconId  23, 24 is set for All Properties and Add a Category
// ? If want to add more Icons in the array then set the iconId except  23,24
