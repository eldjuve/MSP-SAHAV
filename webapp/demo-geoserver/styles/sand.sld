<?xml version='1.0' encoding='UTF-8'?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" version="1.0.0"><NamedLayer>
        <Name>MSPudhu:Sand_Dune</Name>
        <UserStyle>
            <Name>sand</Name>
            <Title>Red, translucent style</Title>
            <IsDefault>1</IsDefault>
            <Abstract>A sample style that just prints out a transparent red interior with a red outline</Abstract>
            <FeatureTypeStyle>
                <Name>name</Name>
                <Rule>
                    <Title>RedFill RedOutline</Title>
                    <Abstract>70% opaque red fill with a darker 1px red outline</Abstract>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#eed487</CssParameter>
                            <CssParameter name="fill-opacity">0.7</CssParameter>
                        </Fill>
                        <Stroke>
                            <CssParameter name="stroke">#AA0000</CssParameter>
                            <CssParameter name="stroke-width">1.5</CssParameter>
                        </Stroke>
                    </PolygonSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
    </StyledLayerDescriptor>