import 'package:flutter/material.dart';

import '../models/post_example.dart';
import '../services/api_example.dart';

class RequestExample extends StatefulWidget {
  const RequestExample({super.key});

  @override
  State<RequestExample> createState() => _RequestExampleState();
}

class _RequestExampleState extends State<RequestExample> {
  final ApiService _apiService = ApiService();

  Post? _post;

  bool _isLoading = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();

    _loadPost();
  }

  Future<void> _loadPost() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final post = await _apiService.getPost();

      setState(() {
        _post = post;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'No se pudo obtener la información.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Prueba de API')),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_errorMessage != null) {
      return Center(child: Text(_errorMessage!));
    }

    if (_post == null) {
      return const Center(child: Text('No hay información disponible.'));
    }

    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            _post!.title,
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),

          const SizedBox(height: 20),

          Text(_post!.body, style: const TextStyle(fontSize: 16)),

          const SizedBox(height: 30),

          ElevatedButton(onPressed: _loadPost, child: const Text('Actualizar')),
        ],
      ),
    );
  }
}