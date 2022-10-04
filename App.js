import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native'

const App = () => {
  const [data, setData] = useState([])
  const [storedata, setStoreData] = useState([])
  const [count, setCount] = useState(1)
  const [select, setSelect] = useState([])
  const [drop, setDrop] = useState(false)
  const [dropDown, setDropData] = useState()


  const handleSearch = (value) => {
    const word = value.toLowerCase().replaceAll(' ', '')
    const wordlength = word.length
    if (word.length > 0) {
      let filterSearch = data.filter(item => word === item.name.toLowerCase().replaceAll(' ', '').slice(0, wordlength))
      setDropData(filterSearch)
    } else {
      setDrop(false)
    }
  }

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFkZjM3ODZiLWRiNDEtNGNhNC1iMjZhLTMzYjZlMzcwOTk1YyIsInR5cGUiOiJndWFyZCIsImlhdCI6MTY2NDUxNjEzNywiZXhwIjoxNjY3MTA4MTM3fQ.CSEJSx65LdKEepABQyFl1aiL94RNULgQAzg6WIDTbcY'
  const network = async (value) => {
    try {
      const data = await fetch(`https://devapi.livo.ae/api/v1/visitings/requested?page=${value}&limit=10`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const json = await data.json()
      setData(json.data)

    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    if (count === 1) {
      network(1)
    }
  }, [])


  const handledata = () => {
    setCount(count + 1)

    if (storedata[storedata.length - 1]?.id !== data[data.length - 1]?.id) {
      data.forEach(item => setStoreData(items => [...items, item]))
    }
    network(count)
  }


  const handleSelect = (value) => {
    const filterdata = select.filter(item => item.index === value.index)
    if (filterdata.length === 1) {
      const datafilter = select.filter(item => item.index !== value.index)
      setSelect(datafilter)
    } else {
      setSelect(item => [...item, value])
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>Searchable dropDown</Text>
      <View style={styles.subcontainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your keyword here"
          onChangeText={item => handleSearch(item)}
          onTouchStart={() => setDrop(true)}
        />
      </View>
      <View style={styles.flatstyle}>
        <FlatList
          data={storedata?.length > 0 ? storedata : data}
          keyExtractor={item => item.id}
          renderItem={item => {
            const value = item.item
            let indicator = select.filter(items => items.item.id === value.id)
            return (
              <TouchableOpacity
                style={{ backgroundColor: item.item.id ===indicator?.[0]?.item.id ? "red" : null }}
                onPress={() => handleSelect(item)}>
                <Text style={styles.subtitle}>{value.name}</Text>
              </TouchableOpacity>
            )
          }}
          ItemSeparatorComponent={() => <View style={{ borderWidth: 0.2 }} />}
          onEndReached={() => handledata()}
        />
      </View>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subcontainer: {
    borderWidth: 1,
    width: "80%",
    padding: 5,
    borderRadius: 10,
    marginTop: 5
  },
  input: {
    color: "red",
  },
  flatstyle: {
    width: '80%',
    padding: 5,
    height: 200
  },
  subtitle: {
    fontSize: 20
  }
})

export default App