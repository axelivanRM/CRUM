import 'package:flutter/material.dart';

import 'screens/request_example.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      //home: Scaffold(body: Center(child: Text('Hello World!'))),
      home: RequestExample(), // Ejemplo de solicitud HTTP
    );
  }
}
