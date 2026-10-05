package com.prachar.payment;

import com.prachar.advertising.AdvertisementPackage;
import com.prachar.advertising.AdvertisementPackageRepository;
import com.prachar.advertising.AdvertisementPackageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MoneyAndPricingSafetyTest {

    @Mock
    private AdvertisementPackageRepository packageRepository;

    @InjectMocks
    private AdvertisementPackageService packageService;

    @BeforeEach
    void setUp() {
        when(packageRepository.findByPackageCode("P1")).thenReturn(Optional.of(new AdvertisementPackage(
                "P1", "B&W Mini-Quarter", "Mini-Quarter Page", "BLACK_AND_WHITE",
                new BigDecimal("550.00"), new BigDecimal("1500.00"), new BigDecimal("150.00"))));

        when(packageRepository.findByPackageCode("P2")).thenReturn(Optional.of(new AdvertisementPackage(
                "P2", "B&W Quarter", "Quarter Page", "BLACK_AND_WHITE",
                new BigDecimal("1030.00"), new BigDecimal("3000.00"), new BigDecimal("90.00"))));

        when(packageRepository.findByPackageCode("P3")).thenReturn(Optional.of(new AdvertisementPackage(
                "P3", "B&W Half Page", "Half Page", "BLACK_AND_WHITE",
                new BigDecimal("2050.00"), new BigDecimal("6000.00"), new BigDecimal("150.00"))));

        when(packageRepository.findByPackageCode("P4")).thenReturn(Optional.of(new AdvertisementPackage(
                "P4", "B&W Full Page", "Full Page", "BLACK_AND_WHITE",
                new BigDecimal("4100.00"), new BigDecimal("12000.00"), new BigDecimal("300.00"))));

        when(packageRepository.findByPackageCode("P5")).thenReturn(Optional.of(new AdvertisementPackage(
                "P5", "Colour Full Page", "Full Page Premium", "FULL_COLOUR",
                new BigDecimal("6000.00"), new BigDecimal("15000.00"), new BigDecimal("3000.00"))));
    }

    @Test
    @DisplayName("Verify exact integer minor units (paise) for all 10 Rate Card packages and edition schemes")
    void testAllRateCardsMinorUnitPrecision() {
        // P1
        assertPaiseConversion("P1", 1, new BigDecimal("550.00"), 55000L);
        assertPaiseConversion("P1", 3, new BigDecimal("1500.00"), 150000L);

        // P2
        assertPaiseConversion("P2", 1, new BigDecimal("1030.00"), 103000L);
        assertPaiseConversion("P2", 3, new BigDecimal("3000.00"), 300000L);

        // P3
        assertPaiseConversion("P3", 1, new BigDecimal("2050.00"), 205000L);
        assertPaiseConversion("P3", 3, new BigDecimal("6000.00"), 600000L);

        // P4
        assertPaiseConversion("P4", 1, new BigDecimal("4100.00"), 410000L);
        assertPaiseConversion("P4", 3, new BigDecimal("12000.00"), 1200000L);

        // P5
        assertPaiseConversion("P5", 1, new BigDecimal("6000.00"), 600000L);
        assertPaiseConversion("P5", 3, new BigDecimal("15000.00"), 1500000L);
    }

    private void assertPaiseConversion(String packageCode, int editionCount, BigDecimal expectedInr, long expectedPaise) {
        BigDecimal calculated = packageService.calculatePrice(packageCode, editionCount);
        assertEquals(0, expectedInr.compareTo(calculated), "INR amount mismatch for " + packageCode + " editions=" + editionCount);

        long minorUnits = calculated.multiply(BigDecimal.valueOf(100)).setScale(0, RoundingMode.UNNECESSARY).longValue();
        assertEquals(expectedPaise, minorUnits, "Paise minor units mismatch for " + packageCode + " editions=" + editionCount);

        BigDecimal reconstituted = BigDecimal.valueOf(minorUnits).divide(BigDecimal.valueOf(100), 2, RoundingMode.UNNECESSARY);
        assertEquals(0, expectedInr.compareTo(reconstituted), "Reconstituted INR mismatch for " + packageCode);
    }
}
