<?xml version='1.0' encoding='UTF-8'?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" version="1.0.0"><NamedLayer>
        <Name>MSPudhu:Industry</Name>
        <UserStyle>
            <Name>hexagon</Name>
            <IsDefault>1</IsDefault>
            <FeatureTypeStyle>
                <Name>name</Name>
                <Rule>
                    <Name>Single symbol</Name>
                    <PointSymbolizer>
                        <Graphic>
                            <Mark>
                                <WellKnownName>pentagon</WellKnownName>
                                <Fill>
                                    <CssParameter name="fill">#00e100</CssParameter>
                                </Fill>
                                <Stroke>
                                    <CssParameter name="stroke-width">0.5</CssParameter>
                                </Stroke>
                            </Mark>
                            <Size>14</Size>
                        </Graphic>
                    </PointSymbolizer>
                    <PointSymbolizer>
                        <Graphic>
                            <Mark>
                                <WellKnownName>circle</WellKnownName>
                                <Fill>
                                    <CssParameter name="fill">#000000</CssParameter>
                                </Fill>
                                <Stroke />
                            </Mark>
                            <Size>3</Size>
                        </Graphic>
                    </PointSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
    </StyledLayerDescriptor>