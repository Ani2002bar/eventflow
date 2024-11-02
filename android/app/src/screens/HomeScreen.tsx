import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList, Button } from 'react-native';
import MyView from '../components/MyView';
import MyText from '../components/MyText';
import Search from '../components/Search';
import Category from '../components/Category';
import firestore from '@react-native-firebase/firestore';
import FoodCard from '../components/FoodCard';

type CategoryType = {
  title: string;
  imageURL: string;
  key: string;
};

type FoodType = {
  title: string;
  price: number;
  imageURL: string;
  key: string;
};

type HomeScreenProps = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [foods, setFoods] = useState<FoodType[]>([]);

  const testUpdate = () => {
    firestore()
      .collection("foods")
      .doc("A5MwWTV40gr8yyh3M3FN")
      .update({
        title: "only salad",
        price: 9.05,
        imageURL: "https://c8.alamy.com/comp/2CB3A77/green-salad-in-a-transparent-bowl-isolated-on-white-2CB3A77.jpg"
      });
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('catogries')
      .onSnapshot(querySnapshot => {
        const categories: CategoryType[] = [];

        querySnapshot.forEach(documentSnapshot => {
          categories.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          } as CategoryType);
        });

        setCategories(categories);
        setLoading(false);
      });

    return () => subscriber();
  }, []);

  useEffect(() => {
    const subscriber = firestore().collection("foods").onSnapshot((res) => {
      const foods: FoodType[] = [];

      res.forEach(documentSnapshot => {
        foods.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        } as FoodType);
      });

      setFoods(foods);
    });

    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <MyView style={styles.con}>
      <MyText style={{ marginTop: 57, marginBottom: 7, marginLeft: 21, fontSize: 19 }}>
        Choose the
      </MyText>
      <MyText boldy style={styles.text}>
        Food You Love
      </MyText>
      <Search />
      <MyText style={styles.text}>Categories</MyText>

      <Button 
        title='Add Category Or Foods'
        onPress={() => navigation.navigate("AddFoodOrCategory")}
      />

      <Button 
        title='test update'
        onPress={testUpdate}
      />

      <View style={{ height: 150 }}>
        <FlatList
          horizontal
          data={categories}
          renderItem={({ item }) => (
            <Category title={item.title} itemKey={item.key} image={{ uri: item.imageURL }} />
          )}
          keyExtractor={item => item.key}
        />
      </View>
      <MyText style={styles.text}>Main Dishes</MyText>

      <FlatList 
        horizontal
        data={foods}
        renderItem={({ item }) => (
          <FoodCard 
            image={item.imageURL}
            title={item.title}
            price={item.price}
            itemKey={item.key}
          />
        )}
        keyExtractor={item => item.key}
      />
    </MyView>
  );
};

const styles = StyleSheet.create({
  con: {
    backgroundColor: '#f7f6ff',
  },
  text: {
    marginLeft: 21,
    fontSize: 19,
    marginBottom: 13,
  },
});

export default HomeScreen;
