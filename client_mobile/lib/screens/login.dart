import 'package:flutter/material.dart';

import '../widgets/button.dart';
import '../widgets/logo.dart';
import '../widgets/text_field.dart';
import '../widgets/login_background.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key, required this.onLogin});

  final Future<void> Function(String email, String password) onLogin;

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _isLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  String? _validateEmail(String? value) {
    final email = value?.trim() ?? '';

    if (email.isEmpty) {
      return 'Ingresa tu correo electrónico';
    }

    if (!RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(email)) {
      return 'Ingresa un correo electrónico válido';
    }

    return null;
  }

  String? _validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Ingresa tu contraseña';
    }

    return null;
  }

  Future<void> _handleLogin() async {
    FocusScope.of(context).unfocus();

    if (_isLoading || !_formKey.currentState!.validate()) {
      return;
    }

    setState(() => _isLoading = true);

    try {
      await widget.onLogin(
        _emailController.text.trim(),
        _passwordController.text,
      );
    } catch (_) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('No fue posible iniciar sesión. Inténtalo nuevamente.'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: Stack(
        children: [
          // Fondo fijo en la parte inferior.
          const Positioned(
            child: LoginBackground(
              height: 235,
              fit: BoxFit.cover,
              alignment: Alignment.bottomCenter,
            ),
          ),

          // Formulario desplazable.
          SafeArea(
            child: LayoutBuilder(
              builder: (context, constraints) {
                return SingleChildScrollView(
                  keyboardDismissBehavior:
                      ScrollViewKeyboardDismissBehavior.onDrag,
                  padding: EdgeInsets.fromLTRB(
                    19,
                    20,
                    19,
                    constraints.maxHeight * 0.30,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const CrumLogo(),

                      SizedBox(height: constraints.maxHeight * 0.14),

                      Text(
                        'Iniciar sesión',
                        textAlign: TextAlign.center,
                        style: theme.textTheme.headlineMedium?.copyWith(
                          fontSize: 36,
                          fontWeight: FontWeight.w700,
                          letterSpacing: -0.8,
                        ),
                      ),

                      const SizedBox(height: 43),

                      Form(
                        key: _formKey,
                        child: Column(
                          children: [
                            CrumTextField(
                              controller: _emailController,
                              hintText: 'Correo electrónico',
                              prefixIcon: Icons.mail_outline,
                              keyboardType: TextInputType.emailAddress,
                              validator: _validateEmail,
                            ),

                            const SizedBox(height: 18),

                            CrumTextField(
                              controller: _passwordController,
                              hintText: 'Contraseña',
                              prefixIcon: Icons.lock_outline,
                              obscureText: true,
                              textInputAction: TextInputAction.done,
                              validator: _validatePassword,
                            ),

                            const SizedBox(height: 44),

                            CrumButton(
                              text: 'Iniciar sesión',
                              onPressed: _handleLogin,
                              isLoading: _isLoading,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
