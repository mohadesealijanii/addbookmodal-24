// const BASE_URL = "https://stg-core.bpapp.net/api"

// export const submitForget = async ({ username }) => {
//   const res = await fetch(
//     `${BASE_URL}/Member/ForgotPassword/${username}`, // Correct use of backticks for template string
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username }),
//     }
//   )
//   return res
// }

// export const submitAccept = async ({ otp, userName, password }) => {
//   const response = await fetch(`${BASE_URL}/Member/ForgotPasswordAccept`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ otp: otp.join(""), userName, password }),
//   })
//   return response
// }

// export const getAllBooks = async ({ pagination }) => {
//   if (!pagination) {
//     console.error("pagination is undefined!")
//     return null
//   }

//   const res = await fetch(`${BASE_URL}/Book/GetBooks`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(pagination),
//   })
//   const data = await res.json()
//   return data
// }

// export const getAllCategories = async () => {
//   const res = await fetch(`${BASE_URL}/BookCategory/GetAllBookCategories`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//   })
//   const data = await res.json()
//   return data.data
// }

import Cookies from "js-cookie"

const token = Cookies.get("authToken")
const BASE_URL = "https://stg-core.bpapp.net/api"
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
}

export const submitForget = async ({ username }) => {
  const res = await fetch(
    `${BASE_URL}/Member/ForgotPassword/${username}`, // Correct use of backticks for template string
    {
      method: "POST",
      headers,
      body: JSON.stringify({ username }),
    }
  )
  return res
}
// mohadese.alijani6@gmail.com

export const submitAccept = async ({ otp, userName, password }) => {
  const response = await fetch(`${BASE_URL}/Member/ForgotPasswordAccept`, {
    method: "POST",
    headers,
    body: JSON.stringify({ otp: otp.join(""), userName, password }),
  })
  return response
}

export const getAllBooks = async ({ pagination }) => {
  if (!pagination) {
    console.error("pagination is undefined!")
    return null
  }

  const res = await fetch(`${BASE_URL}/Book/GetBooks`, {
    method: "POST",
    headers,
    body: JSON.stringify(pagination),
  })
  const data = await res.json()
  return data
}

// export const searchBooks = async () => {
//   const res = await fetch(`${BASE_URL}/api/Book/SearchBooks}`, {
//     method: "POST",
//     headers,
//     body: JSON.stringify(searchResult),
//   });
//   const data = res.json();
//   console.log(data);
// };

export const getAllCategories = async () => {
  const res = await fetch(`${BASE_URL}/BookCategory/GetAllBookCategories`, {
    method: "GET",
    headers,
  })
  const data = await res.json()
  return data.data
}

export const getChapters = async ({ pagination }) => {
  const res = await fetch(`${BASE_URL}/BookChapter/GetChapters`, {
    method: "POST",
    headers,
    body: JSON.stringify(pagination),
  })
  const data = res.json()
  console.log(data)
  return data
}

export const setOffer = async (id) => {
  const res = await fetch(`${BASE_URL}/Book/OfferBook/${id}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ id }),
  })
  const data = await res.json()
  return data
}

export const changeOrder = async (id, order) => {
  const res = await fetch(`${BASE_URL}/Book/ChangeOrder`, {
    method: "POST",
    headers,
    body: JSON.stringify({ id, order }),
  })

  return res
}

export const setFree = async (id, end, start) => {
  const res = await fetch(`${BASE_URL}/Book/FreeBook`, {
    method: "POST",
    headers,
    body: JSON.stringify({ id, end, start }),
  })
  return res
}

export const getBooksAny = async (searchAny) => {
  const res = await fetch(`${BASE_URL}/Book/GetBooksAny`, {
    method: "POST",
    headers,
    body: JSON.stringify(searchAny),
  })
  const data = await res.json()
  console.log(data)
  return data
}

export const newComments = async ({ pagination }) => {
  const res = await fetch(`${BASE_URL}/Book/NewComment`, {
    method: "POST",
    headers,
    body: JSON.stringify(pagination),
  })
  const data = await res.json()
  return data
}

export const changeStatusComment = async ({ commentId, status }) => {
  const res = await fetch(`${BASE_URL}/Book/ChageStatusComment`, {
    method: "POST",
    headers,
    body: JSON.stringify({ commentId, status }),
  })
  console.log(res)
  return res
}
