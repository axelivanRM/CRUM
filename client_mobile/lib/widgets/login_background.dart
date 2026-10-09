
import 'package:flutter/material.dart';

class LoginBackground extends StatelessWidget {
  const LoginBackground({
    super.key,
    this.height = 235,
    this.alignment = Alignment.bottomCenter,
    this.fit = BoxFit.contain,
  });

  final double height;
  final AlignmentGeometry alignment;
  final BoxFit fit;

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: Align(
        alignment: alignment,
        child: SizedBox(
          width: double.infinity,
          height: height,
          child: Image.asset(
            'assets/images/fondo_movil_4.png',
            fit: fit,
            alignment: Alignment.bottomCenter,
            errorBuilder: (context, error, stackTrace) {
              return const SizedBox.shrink();
            },
          ),
        ),
      ),
    );
  }
}
