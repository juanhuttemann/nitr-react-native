import React, {useRef} from 'react';
import {View, StyleSheet, Text, KeyboardAvoidingView} from 'react-native';
import {Button} from 'react-native-elements';
import {TextInput} from 'react-native-paper';
import {Formik} from 'formik';
import RNPickerSelect from 'react-native-picker-select';
import * as Yup from 'yup';
import uuid from 'uuid-random';
import Toast from 'react-native-simple-toast';

import PouchDB from 'pouchdb';
PouchDB.plugin(require('pouchdb-adapter-asyncstorage').default);
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('localDB2', {adapter: 'asyncstorage'});

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const HostSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Too Short!')
    .max(20, 'Too Long!')
    .required('Required'),
  domain: Yup.string().required('Required'),
  port: Yup.string().required('Required'),
  key: Yup.string().required('Required'),
});

export default ({navigation, route}) => {
  const {host} = route.params;
  console.log(host);
  const descriptionInput = useRef(null);
  return (
    <KeyboardAwareScrollView enableOnAndroid={true}>
      <Formik
        initialValues={
          !host
            ? {
                _id: 'host_' + uuid(),
                name: '',
                description: '',
                domain: '',
                port: '8000',
                type: '',
                key: '',
              }
            : host
        }
        validationSchema={HostSchema}
        onSubmit={values => {
          db.put(values)
            .then(function(response) {
              navigation.navigate('Hosts');
              Toast.show('Success!');
            })
            .catch(function(err) {
              console.log(err);
            });
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          isValid,
          touched,
          errors,
        }) => (
          <>
            <TextInput
              style={styles.input}
              label="Name"
              type="outlined"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              autoCorrect={false}
            />
            {touched.name && errors.name && (
              <Text style={{fontSize: 10, color: 'red', marginBottom: 10}}>
                {errors.name}
              </Text>
            )}
            <TextInput
              style={styles.input}
              label="Description"
              type="outlined"
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
              ref={descriptionInput}
            />
            <TextInput
              style={styles.input}
              label="IP or Domain"
              type="outlined"
              onChangeText={handleChange('domain')}
              onBlur={handleBlur('domain')}
              value={values.domain}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {touched.domain && errors.domain && (
              <Text style={{fontSize: 10, color: 'red', marginBottom: 5}}>
                {errors.domain}
              </Text>
            )}
            <TextInput
              style={styles.input}
              label="Port"
              type="outlined"
              onChangeText={handleChange('port')}
              onBlur={handleBlur('port')}
              value={values.port}
              keyboardType="numeric"
            />
            {touched.port && errors.port && (
              <Text style={{fontSize: 10, color: 'red'}}>{errors.port}</Text>
            )}
            <TextInput
              style={styles.input}
              label="API Key"
              type="outlined"
              onChangeText={handleChange('key')}
              onBlur={handleBlur('key')}
              value={values.key}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {touched.key && errors.key && (
              <Text style={{fontSize: 10, color: 'red'}}>{errors.key}</Text>
            )}

            <RNPickerSelect
              style={pickerSelectStyles}
              placeholder={
                !host
                  ? {
                      label: 'Host type...',
                      value: '',
                      color: '#9EA0A4',
                    }
                  : {}
              }
              onValueChange={handleChange('type')}
              items={[
                {key: 'Server', label: 'Server', value: 'Server'},
                {key: 'PC', label: 'PC', value: 'PC'},
                {key: 'Laptop', label: 'Laptop', value: 'Laptop'},
              ]}
            />
            <Button
              onPress={handleSubmit}
              title="Submit"
              disabled={!isValid}
              containerStyle={styles.submit}
            />
          </>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  input: {
    color: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submit: {
    marginTop: 10,
    marginHorizontal: 5,
    marginBottom: 10,
  },
});
