import 'package:flutter/material.dart';

import 'theme/app_theme.dart';
import 'package:crum_mobile/screens/login.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: AppTheme.light,
      //home: Scaffold(body: Center(child: Text('Hello World!'))),
      //home: RequestExample(), // Ejemplo de solicitud HTTP,
      home: LoginScreen(
        onLogin: (email, password) async {
          // TODO: conectar con el servicio de autenticación.
        },
      ),
    );
  }
}
