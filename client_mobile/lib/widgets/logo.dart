
import 'package:flutter/material.dart';

class CrumLogo extends StatelessWidget {
  const CrumLogo({
    super.key,
    this.width = 165,
    this.alignment = Alignment.center,
  });

  final double width;
  final AlignmentGeometry alignment;

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: alignment,
      child: Image.asset(
        'assets/images/logo_crum.png',
        width: width,
        fit: BoxFit.contain,
        semanticLabel: 'CRUM',
        errorBuilder: (context, error, stackTrace) {
          return Text(
            'CRUM',
            style: TextStyle(
              color: Theme.of(context).colorScheme.primary,
              fontSize: width * 0.22,
              fontWeight: FontWeight.w800,
            ),
          );
        },
      ),
    );
  }
}
