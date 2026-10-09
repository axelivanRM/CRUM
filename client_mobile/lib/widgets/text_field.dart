
import 'package:flutter/material.dart';

class CrumTextField extends StatefulWidget {
  const CrumTextField({
    super.key,
    required this.controller,
    required this.hintText,
    required this.prefixIcon,
    this.keyboardType = TextInputType.text,
    this.validator,
    this.obscureText = false,
    this.textInputAction = TextInputAction.next,
  });

  final TextEditingController controller;
  final String hintText;
  final IconData prefixIcon;
  final TextInputType keyboardType;
  final String? Function(String?)? validator;
  final bool obscureText;
  final TextInputAction textInputAction;

  @override
  State<CrumTextField> createState() => _CrumTextFieldState();
}

class _CrumTextFieldState extends State<CrumTextField> {
  late bool _obscured;

  @override
  void initState() {
    super.initState();
    _obscured = widget.obscureText;
  }

  @override
  void didUpdateWidget(covariant CrumTextField oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (oldWidget.obscureText != widget.obscureText) {
      _obscured = widget.obscureText;
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;

    return TextFormField(
      controller: widget.controller,
      keyboardType: widget.keyboardType,
      validator: widget.validator,
      obscureText: _obscured,
      textInputAction: widget.textInputAction,
      autocorrect: false,
      enableSuggestions: !widget.obscureText,
      style: TextStyle(
        color: colors.onSurface,
        fontSize: 14,
      ),
      decoration: InputDecoration(
        hintText: widget.hintText,
        prefixIcon: Icon(
          widget.prefixIcon,
          size: 21,
        ),
        suffixIcon: widget.obscureText
            ? IconButton(
                tooltip: _obscured
                    ? 'Mostrar contraseña'
                    : 'Ocultar contraseña',
                onPressed: () {
                  setState(() => _obscured = !_obscured);
                },
                icon: Icon(
                  _obscured
                      ? Icons.visibility_outlined
                      : Icons.visibility_off_outlined,
                  size: 21,
                ),
              )
            : null,
      ),
    );
  }
}
