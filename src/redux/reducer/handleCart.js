
import { createSlice } from "@reduxjs/toolkit";
const handleCart=createSlice({
    name:"handleCart",
    initialState:[],
    reducers:{
        addItem(state,action){
            const product=action.payload;
            console.log(state,"state hain ")
            // Check if product already in cart
            const exist=state.find((x)=>x.id===product.id)
            if(exist){
                //increase the quantity
                return state.map((x)=>x.id===product.id?{...x,qty:x.qty+1}:x)
            }
            else {return [...state,{...product,qty:1}]}

        },
        deleteItem(state,action){
            const product=action.payload;
            const exist2 = state.find((x) => x.id === product.id)
            if(exist2.qty === 1){
             return state.filter((x)=>x.id!==exist2.id)
                            }
                            else{
                                return state.map((x)=> x.id===product.id?{...x, qty:x.qty-1}:x)
                            }

        }
    }
})

export const {addItem,deleteItem}=handleCart.actions
export default handleCart.reducer


// const cart = []

// const handleCart = (state=cart, action) =>{
//     const product = action.payload
//     switch(action.type){
//         case "ADDITEM":
//             // Check if product already in cart
//             const exist = state.find((x) => x.id === product.id)
//             if(exist){
//                 // Increase the quantity
//                 return state.map((x)=>x.id ===product.id?{...x, qty: x.qty+1}:x)
//             }
//             else{
//                 return [...state, {...product, qty:1}]
//             }
//             break;
//         case "DELITEM":
//             const exist2 = state.find((x) => x.id === product.id)
//             if(exist2.qty === 1){
//                 return state.filter((x)=>x.id!==exist2.id)
//             }
//             else{
//                 return state.map((x)=> x.id===product.id?{...x, qty:x.qty-1}:x)
//             }
//             break;

//         default:
//             return state
//             break;
//     }
// }

// export default handleCart