import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/post_example.dart';

import 'dart:math';

class ApiService {
  static const String baseUrl = 'https://jsonplaceholder.typicode.com';

  Future<Post> getPost() async {
    final random = Random();
    int numero = 1 + random.nextInt(99);
    final response = await http.get(Uri.parse('$baseUrl/posts/$numero'));

    if (response.statusCode == 200) {
      final json = jsonDecode(response.body);

      return Post.fromJson(json);
    }

    throw Exception('Error al obtener el post: ${response.statusCode}');
  }
}